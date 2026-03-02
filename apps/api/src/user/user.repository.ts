import { Injectable, Logger } from '@nestjs/common';
import { IUser } from '@repo/schemas';
import * as bcrypt from 'bcrypt';
import { CouchbaseService } from '@/couchbase/couchbase.service';
import { generateId } from '@/common/utils/id-generator';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly couchbaseService: CouchbaseService) {}

  async findAll(): Promise<IUser[]> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`User` LIMIT 100');
      return result.map((row: any) => row.User);
    } catch (error) {
      this.logger.error('findAll error:', error);
      return [];
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`User` USE KEYS $1', [id]);
      return result.length > 0 ? result[0].User : null;
    } catch (error) {
      this.logger.error('findById error:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`User` WHERE email = $1 LIMIT 1', [email]);
      return result.length > 0 ? result[0].User : null;
    } catch (error) {
      this.logger.error('findByEmail error:', error);
      return null;
    }
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`User` WHERE phone = $1 LIMIT 1', [phone]);
      return result.length > 0 ? result[0].User : null;
    } catch (error) {
      this.logger.error('findByPhone error:', error);
      return null;
    }
  }

  async create(user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const hashedPassword = await this.hashPassword(user.password);
    const newUser = { ...user, password: hashedPassword };
    const id = this.generateId();
    const result = await this.couchbaseService.getCollection('User').insert(id, newUser);
    return { id, ...newUser } as IUser;
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }
    const updated = { ...existing, ...user };
    if (user.password) {
      updated.password = await this.hashPassword(user.password);
    }
    await this.couchbaseService.getCollection('User').upsert(id, updated);
    return updated;
  }

  async delete(id: string): Promise<{ cas: any }> {
    await this.couchbaseService.getCollection('User').remove(id);
    return { cas: 0 };
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const user = await this.findByPhone(phone);
    return user !== null;
  }

  async validatePassword(user: IUser, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async searchByKeyword(keyword: string, limit = 10): Promise<IUser[]> {
    try {
      const result = await this.couchbaseService.query('SELECT META().id, * FROM `hilton`.`_default`.`User` WHERE LOWER(email) LIKE $1 OR LOWER(firstName) LIKE $1 OR LOWER(lastName) LIKE $1 LIMIT $2', [
        `%${keyword.toLowerCase()}%`,
        limit,
      ]);
      return result.map((row: any) => row.User);
    } catch (error) {
      this.logger.error('searchByKeyword error:', error);
      return [];
    }
  }

  private generateId(): string {
    return generateId('user_');
  }
}
