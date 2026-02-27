import * as dotenv from 'dotenv';
import { Cluster, connect } from 'couchbase';

dotenv.config({ path: '.env' });

const COUCHBASE_HOST = process.env.COUCHBASE_HOST || 'localhost';
const COUCHBASE_USERNAME = process.env.COUCHBASE_USERNAME || 'admin';
const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD || 'hiltonadmin';
const COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET || 'hilton';

interface BucketSettings {
  name: string;
  ramQuotaMB: number;
  flushEnabled: boolean;
  numReplicas: number;
  replicaIndexes: boolean;
  evictionPolicy: string;
  maxTTL: number;
  compressionMode: string;
}

async function waitForBucketCreation(cluster: Cluster, bucketName: string, timeout = 60000): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      await cluster.buckets().getBucket(bucketName);
      console.log(`✓ Bucket "${bucketName}" 已创建并可用`);
      return;
    } catch (error) {
      if (error.code === 13) {
        console.log(`等待 Bucket "${bucketName}" 创建中...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Bucket "${bucketName}" 创建超时`);
}

async function createBucketIfNotExists(cluster: Cluster, bucketName: string): Promise<void> {
  try {
    await cluster.buckets().getBucket(bucketName);
    console.log(`✓ Bucket "${bucketName}" 已存在`);
  } catch (error) {
    if (error.code === 13) {
      console.log(`正在创建 Bucket "${bucketName}"...`);

      const bucketSettings: BucketSettings = {
        name: bucketName,
        ramQuotaMB: 256,
        flushEnabled: false,
        numReplicas: 0,
        replicaIndexes: false,
        evictionPolicy: 'valueOnly',
        maxTTL: 0,
        compressionMode: 'active',
      };

      await cluster.buckets().createBucket(bucketSettings);
      console.log(`✓ Bucket "${bucketName}" 创建成功`);
      await waitForBucketCreation(cluster, bucketName);
    } else {
      throw error;
    }
  }
}

async function ensureCollectionExists(bucketName: string, scopeName: string, collectionName: string): Promise<void> {
  const connectionString = `couchbase://${COUCHBASE_HOST}`;
  const cluster = await connect(connectionString, {
    username: COUCHBASE_USERNAME,
    password: COUCHBASE_PASSWORD,
  });

  try {
    const bucket = cluster.bucket(bucketName);
    const collectionManager = bucket.collections();

    const scopes = await collectionManager.getAllScopes();
    const scope = scopes.find((s) => s.name === scopeName);

    if (!scope) {
      console.log(`正在创建 Scope "${scopeName}"...`);
      await collectionManager.createScope(scopeName);
      console.log(`✓ Scope "${scopeName}" 创建成功`);
    }

    const updatedScopes = await collectionManager.getAllScopes();
    const targetScope = updatedScopes.find((s) => s.name === scopeName);
    const collectionExists = targetScope?.collections.some((c) => c.name === collectionName);

    if (collectionExists) {
      console.log(`✓ Collection "${scopeName}.${collectionName}" 已存在`);
    } else {
      console.log(`正在创建 Collection "${scopeName}.${collectionName}"...`);
      await collectionManager.createCollection(collectionName, scopeName);
      console.log(`✓ Collection "${scopeName}.${collectionName}" 创建成功`);
    }

    await cluster.close();
  } catch (error) {
    await cluster.close();
    throw error;
  }
}

async function main(): Promise<void> {
  console.log('========================================');
  console.log('Couchbase 数据库初始化脚本');
  console.log('========================================\n');

  console.log('连接信息:');
  console.log(`  - 主机: ${COUCHBASE_HOST}`);
  console.log(`  - 用户名: ${COUCHBASE_USERNAME}`);
  console.log(`  - Bucket: ${COUCHBASE_BUCKET}\n`);

  try {
    const connectionString = `couchbase://${COUCHBASE_HOST}`;
    const cluster = await connect(connectionString, {
      username: COUCHBASE_USERNAME,
      password: COUCHBASE_PASSWORD,
    });

    console.log('✓ Couchbase 连接成功\n');

    await createBucketIfNotExists(cluster, COUCHBASE_BUCKET);
    await cluster.close();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await ensureCollectionExists(COUCHBASE_BUCKET, '_default', '_default');
    await ensureCollectionExists(COUCHBASE_BUCKET, '_default', 'User');
    await ensureCollectionExists(COUCHBASE_BUCKET, '_default', 'Reservation');
    await ensureCollectionExists(COUCHBASE_BUCKET, '_default', 'Hotel');
    await ensureCollectionExists(COUCHBASE_BUCKET, '_default', 'Restaurant');

    console.log('\n========================================');
    console.log('✓ 数据库初始化完成！');
    console.log('========================================');
  } catch (error) {
    console.error('\n========================================');
    console.error('✗ 数据库初始化失败！');
    console.error('========================================');
    console.error(error);
    process.exit(1);
  }
}

main();
