import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'modules/users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {
        const jwtSecret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_ACCESS_TOKEN_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // You can attach whatever you want to `req.user`
        return { userId: payload.sub, email: payload.email };
    }
}
