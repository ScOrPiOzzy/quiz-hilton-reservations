import { Injectable, Inject } from '@nestjs/common';
import { Collection, Scope } from 'couchbase';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(@Inject('COUCHBASE_CLUSTER') protected readonly cluster: any) {}

  protected abstract getCollectionName(): string;

  /**
   * 获取 Scope（延迟加载）
   */
  protected async getScope(): Promise<Scope> {
    const bucketName = process.env.COUCHBASE_BUCKET || 'hilton';
    const scopeName = process.env.COUCHBASE_SCOPE || 'hilton';

    const bucket = this.cluster.bucket(bucketName);
    await bucket.waitUntilReady(5000);

    return bucket.scope(scopeName);
  }

  /**
   * 获取集合
   */
  protected async getCollection(): Promise<Collection> {
    const scope = await this.getScope();
    return scope.collection(this.getCollectionName());
  }

  /**
   * 根据 ID 获取文档
   */
  async findById(id: string): Promise<T | null> {
    try {
      const collection = await this.getCollection();
      const result = await collection.get(id);
      return result.content as T;
    } catch (error: any) {
      if (error.code === 13) {
        // Document not found
        return null;
      }
      throw error;
    }
  }

  /**
   * 创建或更新文档
   */
  async upsert(id: string, data: T): Promise<T> {
    const collection = await this.getCollection();
    await collection.upsert(id, data);
    return data;
  }

  /**
   * 创建新文档
   */
  async create(id: string, data: T): Promise<T> {
    const collection = await this.getCollection();
    await collection.insert(id, data);
    return data;
  }

  /**
   * 更新文档
   */
  async update(id: string, data: T): Promise<T> {
    const collection = await this.getCollection();
    await collection.replace(id, data);
    return data;
  }

  /**
   * 删除文档
   */
  async delete(id: string): Promise<void> {
    const collection = await this.getCollection();
    await collection.remove(id);
  }
}
