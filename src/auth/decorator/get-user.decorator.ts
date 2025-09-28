import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { User } from 'src/users/user.interface';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest<{ user: User }>();
    return req.user;
  },
);
