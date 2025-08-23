import { RateLimitGuard } from './rate-limit.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, BadRequestException } from '@nestjs/common';

function mockContext(ip = '1.1.1.1'): ExecutionContext {
    return {
        switchToHttp: () => ({
            getRequest: () => ({
                headers: {},
                socket: { remoteAddress: ip },
                path: '/test',
                method: 'GET',
            }),
        }),
        getHandler: () => ({} as any),
    } as unknown as ExecutionContext;
}

describe('RateLimitGuard', () => {
    const reflector = { get: jest.fn() } as any;
    const dataSource = { query: jest.fn() } as any;
    const guard = new RateLimitGuard(reflector, dataSource);

    beforeEach(() => {
        reflector.get.mockReturnValue({ windowMs: 1000, max: 2 });
    });

    it('allows requests under limit', async () => {
        const ctx = mockContext();
        await expect(guard.canActivate(ctx)).resolves.toBe(true);
        await expect(guard.canActivate(ctx)).resolves.toBe(true);
    });

    it('blocks after exceeding max', async () => {
        const ctx = mockContext('2.2.2.2');
        await guard.canActivate(ctx);
        await guard.canActivate(ctx);
        await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(BadRequestException);
    });
});