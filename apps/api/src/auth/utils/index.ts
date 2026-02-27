import { JwtPayload } from '@/user/entities/user.entity';
import { IUser } from '@repo/schemas';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * 验证 Token
 */
export function verifyToken(token: string, secret: string): JwtPayload {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    console.log(`🚀 ~ verifyToken ~ error:`, error);
    throw new UnauthorizedException('令牌无效或已过期');
  }
}

/**
 * 生成 Token
 */
export function generateToken(user: IUser, secret: string): string {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    role: user.role,
    email: user.email,
    phone: user.phone,
  };

  return jwt.sign(payload, secret, { expiresIn: '30d' });
}
