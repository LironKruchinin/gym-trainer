import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from 'auth/constants';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh'
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Or ExtractJwt.fromCookie('refresh_token') if you store it in a cookie
            secretOrKey: jwtConstants.refreshSecret,
            passReqToCallback: false,
        });
    }

    async validate(payload: any) {
        // payload should include userId and any token version or jti for revocation
        return { userId: payload.sub, tokenVersion: payload.tokenVersion };
    }
}
