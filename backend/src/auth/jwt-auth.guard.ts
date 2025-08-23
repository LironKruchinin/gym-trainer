import {
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { firstValueFrom, isObservable } from 'rxjs';
import { JwtBlacklistService } from './JwtBlacklistService';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);
    private jwtBlacklistService: JwtBlacklistService;

    constructor(private readonly moduleRef: ModuleRef) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const ip = request.ip || request.connection.remoteAddress || 'unknown';
        const path = request.originalUrl || request.url;

        const token = request.headers['authorization']?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Missing token');
        }

        if (!this.jwtBlacklistService) {
            this.jwtBlacklistService = this.moduleRef.get(JwtBlacklistService, { strict: false });
        }

        try {
            const isBlacklisted = await this.jwtBlacklistService.isTokenBlacklisted(token);
            if (isBlacklisted) {
                throw new UnauthorizedException('Token is blacklisted');
            }
        } catch (err) {
            throw new UnauthorizedException('Token verification failed');
        }

        const result = super.canActivate(context);
        const canActivate = isObservable(result)
            ? await firstValueFrom(result)
            : await Promise.resolve(result);

        return canActivate;
    }
}
