// src/common/guards/roles.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, ctx.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) {
            // no roles metadata → public
            return true;
        }

        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.roles) {
            throw new ForbiddenException('No roles assigned');
        }

        const userRoleNames = user.roles.map(r => r.name);
        const hasRole = requiredRoles.some(role => userRoleNames.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('Insufficient permissions');
        }
        return true;
    }
}
