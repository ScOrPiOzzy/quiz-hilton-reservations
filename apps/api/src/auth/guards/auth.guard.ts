import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKey } from '@/common/constants';
import { verifyToken } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private secret: string;
  constructor(private configService: ConfigService) {
    this.secret = this.configService.getOrThrow<string>(EnvKey.JWT_SECRET);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    console.log(`🚀 ~ AuthGuard ~ canActivate ~ Bearer:`, _);

    if (!token) {
      throw new UnauthorizedException('未提供认证令牌');
    }

    try {
      const payload = verifyToken(token, this.secret);
      // 改写请求信息， 将认证成功后的用户信息（payload）放到 request 中。
      request.user = payload;
      return true;
    } catch (e) {
      console.log(`🚀 ~ AuthGuard ~ canActivate ~ e:`, e);
      throw new UnauthorizedException('令牌无效或已过期');
    }
  }
}
