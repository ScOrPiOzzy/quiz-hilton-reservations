import { map } from 'lodash-es';

export function convertTo<T>(result: any, collectionName = '_default'): T {
  console.log(`🚀 ~ convertTo ~ result:`, result);
  if (Array.isArray(result)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return map(result, ({ id, [collectionName]: data }) => ({ id, ...data })) as T;
  }
  const { id } = result;
  return { id, ...result[collectionName] } as T;
}
