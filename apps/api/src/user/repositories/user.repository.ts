import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import type { IUser } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { SearchConsistency } from 'ottoman';

@Injectable()
export class UserRepository {
  async findAll(): Promise<IUser[]> {
    return (await UserModel.find({}, { consistency: SearchConsistency.LOCAL })) as IUser[];
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const result = await UserModel.find({ email }, { limit: 1 });
    return result.length > 0 ? result[0] : null;
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    const result = await UserModel.find({ phone }, { limit: 1 });
    return result.length > 0 ? result[0] : null;
  }

  async create(user: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const hashedPassword = await this.hashPassword(user.password);
    const newUser = new UserModel({ ...user, password: hashedPassword });
    return await newUser.save();
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    if (user.password) {
      user.password = await this.hashPassword(user.password);
    }
    return await UserModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<{ cas: any }> {
    return await UserModel.removeById(id);
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
    const lowerKeyword = keyword.toLowerCase();
    const results = await UserModel.find(
      {
        $or: [{ email: { $like: `%${lowerKeyword}%` } }, { firstName: { $like: `%${lowerKeyword}%` } }, { lastName: { $like: `%${lowerKeyword}%` } }],
      },
      { limit },
    );

    return results;
  }
}
