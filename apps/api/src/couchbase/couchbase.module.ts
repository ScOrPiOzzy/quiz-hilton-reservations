import { Module, DynamicModule, Global } from '@nestjs/common';
import { CouchbaseModuleAsyncOptions } from './couchbase.interfaces';
import { CouchbaseService } from './couchbase.service';
import { OttomanService } from './ottoman.service';
import { COUCHBASE_OPTIONS } from './couchbase.constants';

@Global()
@Module({})
export class CouchbaseModule {
  static forRootAsync(options: CouchbaseModuleAsyncOptions): DynamicModule {
    return {
      module: CouchbaseModule,
      imports: options.imports || [],
      providers: [
        {
          provide: COUCHBASE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        CouchbaseService,
        OttomanService,
      ],
      exports: [COUCHBASE_OPTIONS, CouchbaseService, OttomanService],
    };
  }
}
