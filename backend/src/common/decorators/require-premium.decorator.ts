import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UseGuards,
    applyDecorators,
} from '@nestjs/common';

@Injectable()
class RequirePremiumGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const user = req.user;

        if (!user || user.subscription_status !== 'premium') {
            throw new ForbiddenException('Premium access required');
        }

        return true;
    }
}

export function RequirePremium() {
    return applyDecorators(UseGuards(RequirePremiumGuard));
}
