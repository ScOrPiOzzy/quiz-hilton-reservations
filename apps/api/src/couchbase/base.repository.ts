import { Collection, DocumentNotFoundError } from 'couchbase';
import { CouchbaseService } from './couchbase.service';
import { Logger } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';

/**
 * 提供基础的 CURD 操作
 */
export class BaseRepository<T extends { id: string }> {
  protected readonly logger = new Logger(BaseRepository.name);

  constructor(
    protected readonly couchbaseService: CouchbaseService,
    protected readonly collectionName: string,
  ) {}

  protected get collection(): Collection {
    return this.couchbaseService.getCollection(this.collectionName);
  }

  protected get fullCollectionName(): string {
    return `\`${this.couchbaseService.getBucketName()}\`._default.\`${this.collectionName}\``;
  }

  async findById(id: string): Promise<T | null> {
    try {
      const result = await this.collection.get(id);
      return result.content as T;
    } catch (error: any) {
      if (error instanceof DocumentNotFoundError) {
        return null;
      }
      this.logger.error(`🚀 ~ BaseRepository ~ findById ~ error:`, error);
      throw error;
    }
  }

  async findByIds(ids: string[]): Promise<T[]> {
    const results = await Promise.allSettled(ids.map((id) => this.findById(id)));

    return results.filter((result) => result.status === 'fulfilled' && result.value !== null).map((result) => (result as PromiseFulfilledResult<T>).value);
  }

  async create(document: Omit<T, 'id'>, id?: string): Promise<T> {
    const docId = id || this.generateId();
    const newDoc = { id: docId, ...document } as T;

    try {
      await this.collection.insert(docId, newDoc);
      return newDoc;
    } catch (error) {
      this.logger.error(`🚀 ~ BaseRepository ~ create ~ error:`, error);
      throw error;
    }
  }

  async update(id: string, updates: Partial<Omit<T, 'id'>>): Promise<T | null> {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        return null;
      }

      const updatedDoc = { ...existing, ...updates } as T;
      await this.collection.replace(id, updatedDoc);
      return updatedDoc;
    } catch (error) {
      this.logger.error(`🚀 ~ BaseRepository ~ update ~ error:`, error);
      throw error;
    }
  }

  async partialUpdate(id: string, updates: Partial<Omit<T, 'id'>>): Promise<boolean> {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        return false;
      }

      const updatedDoc = { ...existing, ...updates } as T;
      await this.collection.replace(id, updatedDoc);
      return true;
    } catch (error: any) {
      if (error instanceof DocumentNotFoundError) {
        return false;
      }
      this.logger.error(`🚀 ~ BaseRepository ~ partialUpdate ~ error:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.collection.remove(id);
      return true;
    } catch (error: any) {
      if (error instanceof DocumentNotFoundError) {
        return false;
      }
      this.logger.error(`🚀 ~ BaseRepository ~ delete ~ error:`, error);
      throw error;
    }
  }

  async findAll(limit: number = 100, offset: number = 0): Promise<T[]> {
    try {
      const cluster = this.couchbaseService.getCluster();
      const query = `
        SELECT META().id as id, *
        FROM ${this.fullCollectionName}
        LIMIT $1 OFFSET $2
      `;
      const result = await cluster.query(query, {
        parameters: [limit, offset],
      });
      return result.rows.map(({ id, _default }) => ({ id, ..._default }) as T);
    } catch (error) {
      this.logger.error(`🚀 ~ BaseRepository ~ findAll ~ error:`, error);
      throw error;
    }
  }

  async query<T = any>(sql: string, params?: any): Promise<T[]> {
    // 主要是去掉块文本的换行, 多余的空格之类的
    this.logger.log(`Executing query: ${sql.replace(/\s/g, ' ')}, params: ${JSON.stringify(params)}`);
    try {
      const cluster = this.couchbaseService.getCluster();
      const result = await cluster.query(sql, { parameters: params });
      this.logger.log(`Query returned ${result.rows.length} rows`);
      return result.rows as T[];
    } catch (error) {
      this.logger.error(`query: ${sql}, params: ${JSON.stringify(params)}`, error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      const cluster = this.couchbaseService.getCluster();
      const query = `
        SELECT COUNT(*) as count
        FROM ${this.fullCollectionName}
      `;
      const result = await cluster.query(query);
      return result.rows[0].count as number;
    } catch (error) {
      this.logger.error(`🚀 ~ BaseRepository ~ count ~ error:`, error);
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      await this.collection.get(id, { timeout: 1000 });
      return true;
    } catch (error: any) {
      if (error instanceof DocumentNotFoundError) {
        return false;
      }
      this.logger.error(`🚀 ~ BaseRepository ~ exists ~ error:`, error);
      throw error;
    }
  }

  async upsert(document: T, id?: string): Promise<T> {
    const docId = id || document.id;
    const newDoc = { ...document, id: docId } as T;

    try {
      await this.collection.upsert(docId, newDoc);
      return newDoc;
    } catch (error) {
      this.logger.error(`🚀 ~ BaseRepository ~ upsert ~ error:`, error);
      throw error;
    }
  }

  protected generateId(): string {
    return createId();
  }
}
