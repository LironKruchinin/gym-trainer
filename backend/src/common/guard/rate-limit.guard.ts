// src/common/guards/rate-limit.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';
import { DataSource } from 'typeorm';

interface RateLimitEntry {
    count: number;
    expiresAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private dataSource: DataSource,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();

        const ip =
            req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
            req.socket.remoteAddress ||
            req.ip ||
            'unknown';

        const options = this.reflector.get<RateLimitOptions>(
            RATE_LIMIT_KEY,
            context.getHandler(),
        );
        if (!options) return true;

        const now = Date.now();
        const key = `${ip}:${context.getHandler().name || req.url}`;
        const entry = rateLimitStore.get(key);

        let status = 'allowed';
        let count = 1;

        if (!entry || now > entry.expiresAt) {
            rateLimitStore.set(key, {
                count: 1,
                expiresAt: now + options.windowMs,
            });
        } else {
            if (entry.count >= options.max) {
                status = 'blocked';
                await this.logAttempt(ip, req, status, entry.count, options);
                throw new BadRequestException('Too many requests — please try again later.');
            }

            entry.count += 1;
            count = entry.count;
            rateLimitStore.set(key, entry);
        }

        await this.logAttempt(ip, req, status, count, options);
        return true;
    }

    private async logAttempt(
        ip: string,
        req: Request,
        status: string,
        count: number,
        options: RateLimitOptions,
    ) {
        try {
            await this.dataSource.query(
                `INSERT INTO rate_limit_logs 
         (ip_address, endpoint, method, user_agent, status, count, max, window_ms)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    ip,
                    req.path,
                    req.method,
                    req.headers['user-agent'] || null,
                    status,
                    count,
                    options.max,
                    options.windowMs,
                ],
            );
        } catch (err) {
            console.error('❌ Failed to log rate limit entry', err);
        }
    }
}
