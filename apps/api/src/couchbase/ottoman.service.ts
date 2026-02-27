import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Cluster, connect } from 'couchbase';
import { Ottoman } from 'ottoman';
import { COUCHBASE_OPTIONS } from './couchbase.constants';
import type { CouchbaseConfig } from './couchbase.interfaces';
import { ottomanInstance } from './ottoman-instance';
import * as couchbase from 'couchbase';

@Injectable()
export class OttomanService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OttomanService.name);
  private cluster: Cluster | null = null;

  constructor(@Inject(COUCHBASE_OPTIONS) private readonly options: CouchbaseConfig) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      await this.$initOttoman();
      this.logger.log('Ottoman 连接成功');
    } catch (error) {
      this.logger.error('Ottoman 连接失败', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await ottomanInstance.close();
      this.logger.log('Ottoman 连接已关闭');
    } catch (error) {
      this.logger.error('关闭 Ottoman 连接时出错', error);
    }

    if (this.cluster) {
      try {
        await this.cluster.close();
        this.logger.log('Couchbase 连接已关闭');
      } catch (error) {
        this.logger.error('关闭 Couchbase 连接时出错', error);
      }
    }
  }

  private async $connect(): Promise<void> {
    const connectionString = this.options.host;
    const username = this.options.username;
    const password = this.options.password;
    const timeouts = this.options.timeouts || { connectTimeout: 30000, kvTimeout: 10000 };

    this.cluster = await connect(connectionString, {
      username,
      password,
      timeouts,
    });
    this.logger.log(`Couchbase 连接成功: ${connectionString}, bucket: ${this.options.bucket}`);
  }

  private async $initOttoman(): Promise<void> {
    const bucketName = this.options.bucket;

    await new Promise(resolve => setTimeout(resolve, 2000));

    (ottomanInstance as any)._cluster = this.cluster!;
    (ottomanInstance as any).bucket = this.cluster!.bucket(bucketName);
    (ottomanInstance as any).bucketName = bucketName;
    (ottomanInstance as any).couchbase = couchbase;

    try {
      await ottomanInstance.ensureIndexes({ ignoreWatchIndexes: true });
    } catch (error) {
      this.logger.warn('索引初始化警告:', error);
    }

    this.logger.log('Ottoman ODM 初始化成功');
  }

  getCluster(): Cluster {
    if (!this.cluster) {
      throw new Error('Couchbase 连接尚未建立');
    }
    return this.cluster;
  }

  getBucketName(): string {
    return this.options.bucket;
  }

  getBucket(name?: string) {
    const bucketName = name || this.options.bucket;
    return this.getCluster().bucket(bucketName);
  }

  getScope(scopeName: string = '_default') {
    return this.getBucket().scope(scopeName);
  }
}
