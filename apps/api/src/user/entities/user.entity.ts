import { Schema, Prop /*, Key*/ } from 'nestjs-couchbase';
// 当前版本的nestjs-couchbase对于 util 包的导出有错误，暂时只能手动指定到 util 目录
import { Key } from 'nestjs-couchbase/dist/util';

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
 * 使用 nestjs-couchbase 装饰器定义 Schema
 */
@Schema({
  collection: 'users',
  scope: '_default',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User {
  @Prop()
  @Key({ prefix: 'user::' })
  id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
