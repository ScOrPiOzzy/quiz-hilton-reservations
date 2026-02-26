import { Module } from '@nestjs/common';
import { RestaurantModule } from './restaurant/restaurant.module';
import { HotelModule } from './hotel/hotel.module';
import { ReservationModule } from './reservation/reservation.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CouchbaseModule } from './couchbase/couchbase.module';
import { EnvKey } from './common/constants';
import type { CouchbaseConfig } from './couchbase/couchbase.interfaces';

@Module({
  imports: [
    // 配置模块（全局）
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Couchbase 数据库 - 直接内联配置
    CouchbaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): CouchbaseConfig => ({
        host: `couchbase://${configService.get(EnvKey.COUCHBASE_HOST, 'localhost')}`,
        username: configService.get(EnvKey.COUCHBASE_USERNAME, 'admin'),
        password: configService.get(EnvKey.COUCHBASE_PASSWORD, 'password'),
        bucket: configService.get(EnvKey.COUCHBASE_BUCKET, 'hilton'),
        timeouts: {
          kvTimeout: 10000,
          connectTimeout: 30000,
        },
      }),
    }),
    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    // 业务模块
    AuthModule,
    HotelModule,
    ReservationModule,
    RestaurantModule,
    UserModule,
  ],
})
export class AppModule {}
