import { Injectable, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginWithEmailDto } from '@/auth/dto/login-with-email.dto';
import { LoginWithCodeDto } from '@/auth/dto/login-with-code.dto';
import { SendCodeDto } from '@/auth/dto/send-code.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { UserRepository } from '@/user/repositories/user.repository';
import { User } from '@/user/entities/user.entity';
import { EnvKey } from '@/common/constants';
import { omit } from 'lodash-es';
import { generateToken } from './utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private jwtSecret: string;

  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    this.jwtSecret = this.configService.getOrThrow<string>(EnvKey.JWT_SECRET);
  }

  /**
   * 邮箱密码登录
   */
  async loginWithEmail(account: LoginWithEmailDto): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const { email, password } = account;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.log(`邮箱不存在: ${email}`);
      throw new UnauthorizedException('用户名或密码错误');
    }
    const isPasswordValid = await this.userRepository.validatePassword(user, password);
    if (!isPasswordValid) {
      this.logger.log(`密码不匹配`);
      throw new UnauthorizedException('用户名或密码错误');
    }

    const token = generateToken(user, this.jwtSecret);
    this.logger.log(`用户登录成功: ${email}`);
    return { token, user: omit(user, 'passwordHash') };
  }

  /**
   * 手机验证码登录
   */
  async loginWithCode(dto: LoginWithCodeDto): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const { phone, code } = dto;

    // 暂且使用 6666 作为验证码
    if (code !== '6666') {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const user = await this.userRepository.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const token = generateToken(user, this.jwtSecret);
    this.logger.log(`用户验证码登录成功: ${phone}`);
    return { token, user: omit(user, 'passwordHash') };
  }

  /**
   * 发送验证码
   */
  async sendCode(dto: SendCodeDto): Promise<{ success: boolean; message: string }> {
    const { phone } = dto;

    // 检查用户是否存在
    const user = await this.userRepository.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // Mock: 验证码统一为 6666，不需要存储
    this.logger.log(`发送验证码到手机: ${phone}，验证码: 6666`);

    return { success: true, message: '验证码已发送' };
  }

  /**
   * 用户注册
   */
  async register(dto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    const { firstName, lastName, email, phone, password } = dto;

    // 检查邮箱是否已存在
    if (await this.userRepository.existsByEmail(email)) {
      throw new ConflictException('邮箱已被注册');
    }

    // 检查手机号是否已存在
    if (await this.userRepository.existsByPhone(phone)) {
      throw new ConflictException('手机号已被注册');
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户
    const now = new Date().toISOString();
    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    this.logger.log(`用户注册成功: ${email}`);

    return omit(user, 'passwordHash');
  }
}
