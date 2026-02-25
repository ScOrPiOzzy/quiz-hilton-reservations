export interface JwtPayload {
  // 从 jsonwebtoken 的 JwtPayload 中拷贝的
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
  email: string;
  phone: string;
}

/**
 * 用户实体
 * 纯 TypeScript 类定义，不使用装饰器
 */
export class User {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  passwordHash: string;

  createdAt: Date;

  updatedAt: Date;
}
