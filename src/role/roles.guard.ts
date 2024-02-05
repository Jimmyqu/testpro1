import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
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

  private extractTokenFromHeader(request: Request): string | undefined {
    // @ts-expect-error : 报authorization不存在
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // 白名单
    if (
      request.originalUrl === '/auth/login' ||
      request.originalUrl === '/users/create'
    ) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // 在这里将 payload 挂载到请求对象上 以便可以在路由处理器中访问
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // 1.之前走auth.guard的验证 但是auth.guard拿jwt在 role之后导致始终拿不到
    // 2 现在jwt验证逻辑拿到role里直接取 或者放开auth.guard的验证 换成下面手动取
    const { user } = context.switchToHttp().getRequest();

    // 手动取
    // const jwt = context.switchToHttp().getRequest().rawHeaders[1].split(' ')[1];
    // const user = await this.jwtService.verifyAsync(jwt, {
    //   secret: jwtConstants.secret,
    // });

    // 等级1最大， 用户角色小于指定权限不让通过
    return user.role <= requiredRoles[0];
  }
}
