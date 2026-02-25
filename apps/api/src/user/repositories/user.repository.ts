import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-couchbase';
import { CouchBaseModel } from 'nestjs-couchbase';
import { User } from '@/user/entities/user.entity';

/**
 * User Repository
 * 使用 nestjs-couchbase 官方包提供用户相关的数据库操作
 */
@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: CouchBaseModel<User>) {}

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  /**
   * 根据手机号查找用户
   */
  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone });
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
   * 关键字搜索用户
   */
  async searchByKeyword(keyword: string, limit = 10): Promise<User[]> {
    const sql = `
      SELECT * FROM \`hilton\`.\`_default\`.\`users\`
      WHERE LOWER(email) LIKE $1 OR LOWER(firstName) LIKE $1 OR LOWER(lastName) LIKE $1
      LIMIT $2
    `;
    const result = await this.userModel.query(sql, {
      parameters: [`%${keyword.toLowerCase()}%`, limit],
    });
    return result.rows as User[];
  }

  /**
   * 更新密码
   */
  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return this.userModel.update(id, { passwordHash });
  }

  /**
   * 根据 ID 查找用户（保留此方法用于兼容）
   */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  /**
   * 创建用户
   */
  async create(data: Partial<User>): Promise<User> {
    return this.userModel.create(data);
  }

  /**
   * 更新用户
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    return this.userModel.update(id, data);
  }

  /**
   * 删除用户
   */
  async remove(id: string): Promise<void> {
    return this.userModel.remove(id);
  }
}
