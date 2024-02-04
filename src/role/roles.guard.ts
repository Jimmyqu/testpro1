import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('requiredRoles', requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    // TODO ？？ 这里为什么取不到 auth里放入的user?
    // const { user } = context.switchToHttp().getRequest();

    const jwt = context.switchToHttp().getRequest().rawHeaders[1].split(' ')[1];

    const user = await this.jwtService.verifyAsync(jwt, {
      secret: jwtConstants.secret,
    });

    // 等级1最大， 小于指定权限不让通过
    console.log(user.role, requiredRoles[0]);
    return user.role <= requiredRoles[0];
  }
}
