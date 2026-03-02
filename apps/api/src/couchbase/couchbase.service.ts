import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Cluster, Bucket, Scope, Collection } from 'couchbase';
import { COUCHBASE_OPTIONS } from './couchbase.constants';
import type { CouchbaseConfig } from './couchbase.interfaces';

@Injectable()
export class CouchbaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CouchbaseService.name);

  private cluster: Cluster | null = null;
  private bucket: Bucket | null = null;
  private scope: Scope | null = null;
  private collection: Collection | null = null;

  constructor(@Inject(COUCHBASE_OPTIONS) private readonly options: CouchbaseConfig) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('连接成功');
    } catch (error) {
      this.logger.error('连接失败：', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.cluster) {
        await this.cluster.close();
        this.logger.log('Couchbase connection closed');
      }
    } catch (error) {
      this.logger.error('Error closing Couchbase connection:', error);
    }
  }

  private async $connect(): Promise<void> {
    const { host, bucket, ...options } = this.options;

    this.cluster = await Cluster.connect(host, options);
    this.bucket = this.cluster.bucket(bucket);
    this.scope = this.bucket.scope('_default'); // 使用默认作用域
    this.collection = this.scope.collection('User');
  }

  getCluster(): Cluster {
    if (!this.cluster) {
      throw new Error('cluster not init');
    }
    return this.cluster;
  }

  getBucket(): Bucket {
    if (!this.bucket) {
      throw new Error('bucket not init');
    }
    return this.bucket;
  }

  getScope(): Scope {
    if (!this.scope) {
      throw new Error('scope not init');
    }
    return this.scope;
  }

  getCollection(collectionName?: string): Collection {
    if (collectionName) {
      if (this.scope) {
        this.logger.log(`获取 scope(${this.scope.name}) 集合: ${collectionName}`);
        return this.scope.collection(collectionName);
      }
      this.logger.log(`获取 scope(_default) 集合: ${collectionName}`);
      return this.getBucket().defaultScope().collection(collectionName);
    }

    if (!this.collection) {
      throw new Error('collection not init');
    }
    return this.collection;
  }

  async query<T = any>(sql: string, params?: any): Promise<T[]> {
    const cluster = this.getCluster();
    const result = await cluster.query(sql, { parameters: params });
    console.log(`🚀 ~ CouchbaseService ~ query ~ result:`, JSON.stringify(result.rows));
    return result.rows as T[];
  }

  getBucketName(): string {
    return this.options.bucket;
  }
}
