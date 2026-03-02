import { createId } from '@paralleldrive/cuid2';

/**
 * 生成唯一的 CUID 格式 ID
 * 格式示例: 01h2kz7x3x5z2m0n
 */
export const generateId = (prefix: string = ''): string => {
  return `${prefix}${createId()}`;
};
