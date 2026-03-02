import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserRole, type IUser } from '@repo/schemas';
import type { CreateUserInput } from './dto/create-user.dto';
import type { UpdateUserInput } from './dto/update-user.dto';
import { omit } from 'lodash-es';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return await this.userRepository.findByPhone(phone);
  }

  async create(input: CreateUserInput): Promise<Omit<IUser, 'password'>> {
    const user = await this.userRepository.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      password: input.password,
      role: input.role || UserRole.CUSTOMER,
      verified: false,
    });

    return omit(user, 'password');
  }

  async update(id: string, input: UpdateUserInput): Promise<Omit<IUser, 'password'> | null> {
    const data: any = {};
    if (input.firstName) data.firstName = input.firstName;
    if (input.lastName) data.lastName = input.lastName;
    if (input.email) data.email = input.email;
    if (input.phone) data.phone = input.phone;
    if (input.password) data.password = input.password;
    if (input.role) data.role = input.role;

    const user = await this.userRepository.update(id, data);
    if (user) {
      return omit(user, 'password');
    }
    return null;
  }

  async delete(id: string): Promise<{ cas: any }> {
    return await this.userRepository.delete(id);
  }

  async search(keyword: string, limit = 10): Promise<IUser[]> {
    return await this.userRepository.searchByKeyword(keyword, limit);
  }

  async validatePassword(email: string, password: string): Promise<Omit<IUser, 'password'> | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await this.userRepository.validatePassword(user, password);
    if (!isValid) {
      return null;
    }

    return omit(user, 'password');
  }
}
