import { EnvKey } from '@/common/constants';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CouchBaseModule } from 'nestjs-couchbase';

/**
 * Couchbase 模块
 * 使用 nestjs-couchbase 官方包提供 Couchbase 连接和模型管理
 */
@Global()
@Module({
  imports: [
    CouchBaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connectionString: configService.get<string>(EnvKey.COUCHBASE_HOST, 'couchbase://localhost'),
        username: configService.get<string>(EnvKey.COUCHBASE_USERNAME, 'admin'),
        password: configService.get<string>(EnvKey.COUCHBASE_PASSWORD, 'password'),
        bucketName: configService.get<string>(EnvKey.COUCHBASE_BUCKET, 'hilton'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CouchbaseModule {}
