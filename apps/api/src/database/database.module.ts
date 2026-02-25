import { Global, Module, Provider } from '@nestjs/common';
import { CouchbaseConnection } from './couchbase.connection';
import { ConfigModule } from '@nestjs/config';

const clusterProvider: Provider = {
  provide: 'COUCHBASE_CLUSTER',
  useFactory: async (connection: CouchbaseConnection) => {
    return connection.connect();
  },
  inject: [CouchbaseConnection],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CouchbaseConnection, clusterProvider],
  exports: [CouchbaseConnection, clusterProvider],
})
export class DatabaseModule {}
