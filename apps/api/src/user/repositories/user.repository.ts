import { Injectable, Logger } from '@nestjs/common';
import { User } from '@/user/entities/user.entity';

/**
 * User Repository (Mock 实现)
 * 使用内存数据模拟数据库操作，用于开发和测试
 */
@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  private users: Map<string, User> = new Map();

  constructor() {
    // 初始化一些测试数据
    this.seedMockData();
  }

  /**
   * 初始化测试数据
   */
  private seedMockData() {
    const now = new Date();
    const mockUsers: User[] = [
      {
        id: 'user::1',
        firstName: '张',
        lastName: '三',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        passwordHash: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'user::2',
        firstName: '李',
        lastName: '四',
        email: 'lisi@example.com',
        phone: '13800138001',
        passwordHash: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        createdAt: now,
        updatedAt: now,
      },
    ];

    mockUsers.forEach((user) => {
      this.users.set(user.id, user);
    });

    this.logger.log(`已初始化 ${mockUsers.length} 条 mock 用户数据`);
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Mock: 查找用户 by email: ${email}`);
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  /**
   * 根据手机号查找用户
   */
  async findByPhone(phone: string): Promise<User | null> {
    this.logger.log(`Mock: 查找用户 by phone: ${phone}`);
    for (const user of this.users.values()) {
      if (user.phone === phone) {
        return user;
      }
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
   * 关键字搜索用户
   */
  async searchByKeyword(keyword: string, limit = 10): Promise<User[]> {
    this.logger.log(`Mock: 搜索用户: ${keyword}`);
    const lowerKeyword = keyword.toLowerCase();
    const results: User[] = [];

    for (const user of this.users.values()) {
      if (user.email.toLowerCase().includes(lowerKeyword) || user.firstName.toLowerCase().includes(lowerKeyword) || user.lastName.toLowerCase().includes(lowerKeyword)) {
        results.push(user);
        if (results.length >= limit) {
          break;
        }
      }
    }

    return results;
  }

  /**
   * 更新密码
   */
  async updatePassword(id: string, passwordHash: string): Promise<User> {
    this.logger.log(`Mock: 更新密码: ${id}`);
    const user = this.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.passwordHash = passwordHash;
    user.updatedAt = new Date();
    this.users.set(id, user);
    return user;
  }

  /**
   * 根据 ID 查找用户
   */
  async findById(id: string): Promise<User | null> {
    this.logger.log(`Mock: 查找用户 by id: ${id}`);
    return this.users.get(id) || null;
  }

  /**
   * 创建用户
   */
  async create(data: Partial<User>): Promise<User> {
    const now = new Date();
    const id = data.id || `user::${Date.now()}`;
    const user: User = {
      id,
      firstName: data.firstName!,
      lastName: data.lastName!,
      email: data.email!,
      phone: data.phone!,
      passwordHash: data.passwordHash!,
      createdAt: now,
      updatedAt: now,
    } as User;
    this.users.set(id, user);
    this.logger.log(`Mock: 创建用户: ${id}, ${user.email}`);
    return user;
  }

  /**
   * 更新用户
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) {
      throw new Error('User not found');
    }
    const updatedUser = { ...existing, ...data, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    this.logger.log(`Mock: 更新用户: ${id}`);
    return updatedUser;
  }

  /**
   * 删除用户
   */
  async remove(id: string): Promise<void> {
    this.users.delete(id);
    this.logger.log(`Mock: 删除用户: ${id}`);
  }
}
