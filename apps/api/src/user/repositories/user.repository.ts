import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/couchbase/base.repository';
import { CouchbaseService } from '@/couchbase/couchbase.service';
import * as bcrypt from 'bcrypt';
import type { User } from '@/user/entities/user.entity';
import { convertTo } from '@/couchbase/util';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(couchbaseService: CouchbaseService) {
    super(couchbaseService, 'users');
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    const results = await super.query(
      `SELECT META().id as id, * 
      FROM ${this.fullCollectionName} 
      WHERE email = $email 
      LIMIT 1`,
      { email },
    );

    this.logger.log(`查询结果数量: ${results.length}`, results);
    if (results.length > 0) {
      return this.$convertTo<User>(results[0]);
    }
    return null;
  }

  /**
   * 根据手机号查找用户
   */
  async findByPhone(phone: string): Promise<User | null> {
    const results = await super.query(
      `SELECT META().id as id, * 
      FROM ${this.fullCollectionName} 
      WHERE phone = $phone 
      LIMIT 1`,
      { phone },
    );

    if (results.length > 0) {
      return this.$convertTo<User>(results[0]);
    }
    return null;
  }

  /**
   * 检查邮箱是否已存在
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * 检查手机号是否已存在
   */
  async existsByPhone(phone: string): Promise<boolean> {
    const user = await this.findByPhone(phone);
    return user !== null;
  }

  /**
   * 验证密码
   */
  async validatePassword(user: User, password: string): Promise<boolean> {
    try {
      const match = await bcrypt.compare(password, user.passwordHash);
      this.logger.debug(`用户信息密码 hash： ${user.passwordHash} === ${password}, match:${match}`);
      return match;
    } catch (error) {
      this.logger.error(`密码验证失败: ${error}`);
      return false;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * 关键字搜索用户
   */
  async searchByKeyword(keyword: string, limit = 10): Promise<User[]> {
    const lowerKeyword = keyword.toLowerCase();
    const results = await super.query(
      `SELECT META().id as id, *
      FROM ${this.fullCollectionName}
      WHERE LOWER(email) LIKE $keyword
        OR LOWER(firstName) LIKE $keyword
        OR LOWER(lastName) LIKE $keyword
       LIMIT $limit`,
      { keyword: `%${lowerKeyword}%`, limit },
    );
    return this.$convertTo<User[]>(results);
  }

  private $convertTo<T>(result: any) {
    return convertTo<T>(result, this.collectionName);
  }
}
