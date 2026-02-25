import { Module } from '@nestjs/common';
import { RestaurantModule } from './restaurant/restaurant.module';
import { HotelModule } from './hotel/hotel.module';
import { ReservationModule } from './reservation/reservation.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CouchbaseModule } from './couchbase/couchbase.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // 配置和数据库模块（全局）
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CouchbaseModule,
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
