import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    // Route is public, no roles required
    if (!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found in request');

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User with email ${user.email} does not have the required roles: ${validRoles.join(', ')}`,
    );
  }
}
