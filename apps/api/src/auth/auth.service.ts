import { Logger, UnauthorizedException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginWithEmailDto } from '@/auth/dto/login-with-email.dto';
import { LoginWithCodeDto } from '@/auth/dto/login-with-code.dto';
import { SendCodeDto } from '@/auth/dto/send-code.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { UserRepository } from '@/user/repositories/user.repository';
import { EnvKey } from '@/common/constants';
import { omit } from 'lodash-es';
import { generateToken } from './utils';
import { IUser } from '@/user/models/user.model';

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

  async loginWithEmail(account: LoginWithEmailDto): Promise<{ token: string; user: Omit<IUser, 'password'> }> {
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

    this.logger.log(`用户登录成功: ${email}`);
    return this.$loginSuccess(user);
  }

  async loginWithCode(dto: LoginWithCodeDto): Promise<{ token: string; user: Omit<IUser, 'password'> }> {
    const { phone, code } = dto;

    // 暂且使用 6666 作为验证码
    if (code !== '6666') {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const user = await this.userRepository.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    this.logger.log(`用户验证码登录成功: ${phone}`);
    return this.$loginSuccess(user);
  }

  async sendCode(dto: SendCodeDto): Promise<{ success: boolean; message: string }> {
    const { phone } = dto;

    const user = await this.userRepository.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    this.logger.log(`发送验证码到手机: ${phone}，验证码: 6666`);

    return { success: true, message: '验证码已发送' };
  }

  async register(dto: RegisterDto): Promise<Partial<IUser>> {
    if (await this.userRepository.existsByEmail(dto.email)) {
      throw new ConflictException('邮箱已被注册');
    }

    if (await this.userRepository.existsByPhone(dto.phone)) {
      throw new ConflictException('手机号已被注册');
    }

    const user = await this.userRepository.create(dto.convertToIUser());

    this.logger.log(`用户注册成功: ${JSON.stringify(dto)}`);

    return omit(user, 'password');
  }

  $loginSuccess(user: IUser) {
    const token = generateToken(user, this.jwtSecret);
    return { token, user: omit(user, 'password') };
  }
}
