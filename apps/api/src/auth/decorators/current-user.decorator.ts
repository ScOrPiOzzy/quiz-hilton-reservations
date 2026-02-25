import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@/user/entities/user.entity';
import { get } from 'lodash-es';

export const CurrentUser = createParamDecorator((key: keyof JwtPayload, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as JwtPayload;
  if (key) {
    return get(user, key);
  }
  return user;
});
