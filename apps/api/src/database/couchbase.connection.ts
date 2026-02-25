import { Inject, Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import { Cluster, connect, ConnectOptions } from 'couchbase';

@Injectable()
export class CouchbaseConnection implements OnModuleDestroy {
  private cluster: Cluster | null = null;
  private readonly logger = new Logger(CouchbaseConnection.name);

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  async onModuleDestroy() {
    await this.close();
  }

  async connect(): Promise<Cluster> {
    const host = this.configService.getOrThrow<string>('COUCHBASE_HOST');
    const username = this.configService.get<string>('COUCHBASE_USER');
    const password = this.configService.get<string>('COUCHBASE_PASSWORD');

    this.logger.log(`Couchbase 连接地址： ${host}`);

    const options: ConnectOptions = {
      username,
      password,
      timeouts: {
        kvTimeout: 10_000,
        connectTimeout: 30_000,
      },
    };

    try {
      this.cluster = await connect(host, options);
      this.logger.log('Couchbase 连接成功');
      return this.cluster;
    } catch (error) {
      this.logger.error(`Couchbase 连接失败: host=${host}, user=${username}`, error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.cluster) {
      await this.cluster.close();
      this.cluster = null;
      this.logger.log('Couchbase 连接断开');
    }
  }

  getCluster(): Cluster {
    if (!this.cluster) {
      throw new Error('数据库尚未链接');
    }
    return this.cluster;
  }
}
