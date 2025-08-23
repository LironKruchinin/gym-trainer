import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RequirePremium } from './require-premium.decorator';

class TestGuard {
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user || user.subscription_status !== 'premium') {
            throw new ForbiddenException('Premium access required');
        }
        return true;
    }
}

describe('RequirePremiumGuard', () => {
    const guard = new TestGuard();
    const ctx = (user?: any) => ({
        switchToHttp: () => ({ getRequest: () => ({ user }) }),
    }) as ExecutionContext;

    it('allows premium user', () => {
        expect(guard.canActivate(ctx({ subscription_status: 'premium' }))).toBe(true);
    });

    it('blocks free user', () => {
        expect(() => guard.canActivate(ctx({ subscription_status: 'free' }))).toThrow(ForbiddenException);
    });
});