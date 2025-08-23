import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtBlacklistService {
    private readonly blacklist = new Map<string, Date>();

    async blacklistToken(token: string, expiresAt: Date) {
        this.blacklist.set(token, expiresAt);
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const expiry = this.blacklist.get(token);
        if (!expiry) return false;

        // Auto-clean expired tokens
        if (Date.now() > expiry.getTime()) {
            this.blacklist.delete(token);
            return false;
        }

        return true;
    }
}
