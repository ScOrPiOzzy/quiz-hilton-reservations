import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { CouchbaseConnection } from './couchbase.connection';
import { INestApplication } from '@nestjs/common';

describe('DatabaseModule', () => {
  let app: INestApplication;
  let connection: CouchbaseConnection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [DatabaseModule] }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get<CouchbaseConnection>(CouchbaseConnection);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(connection).toBeDefined();
  });
});
