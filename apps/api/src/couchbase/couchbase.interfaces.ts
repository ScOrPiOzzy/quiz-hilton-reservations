import type { ConnectOptions } from 'couchbase';

/**
 * Couchbase connection configuration interface
 */
export interface CouchbaseConfig extends ConnectOptions {
  host: string;
  bucket: string;
  collection?: string;
}

/**
 * Couchbase module options interface
 */
export interface CouchbaseModuleOptions {
  /** Connection configuration */
  config: CouchbaseConfig;
  /** Whether to automatically connect on module initialization */
  autoConnect?: boolean;
}

/**
 * Async options for Couchbase module
 */
export interface CouchbaseModuleAsyncOptions extends Omit<CouchbaseModuleOptions, 'config'> {
  /** Function to return connection configuration */
  useFactory: (...args: any[]) => Promise<CouchbaseConfig> | CouchbaseConfig;
  /** Dependencies to inject into useFactory */
  inject?: any[];
  /** Optional imports for this module */
  imports?: any[];
}
