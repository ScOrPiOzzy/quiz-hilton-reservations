import { IUser } from '@repo/schemas';

export interface JwtPayload extends Pick<IUser, 'role' | 'email' | 'phone'> {
  sub?: string | undefined;
  exp?: number | undefined;
}
