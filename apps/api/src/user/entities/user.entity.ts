import { IUser } from '../models/user.model';

export interface JwtPayload extends Pick<IUser, 'role' | 'email' | 'phone'> {
  sub?: string | undefined;
  exp?: number | undefined;
}
