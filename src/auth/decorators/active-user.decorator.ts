import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { ActiveUserData } from '../interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ActiveUserData | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request?.user;
  },
);
