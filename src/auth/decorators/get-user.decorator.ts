import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

import { User } from '../entities/user.entity';

interface RequestWithUser extends Request {
  user?: User;
}

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found in request');

    return !data ? user : user[data];
  },
);
