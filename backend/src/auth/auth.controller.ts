// src/modules/auth/auth.controller.ts
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RateLimit } from 'common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../common/guard/rate-limit.guard';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { LoginDto } from '../modules/users/dto/login.dto';
import { successResponse } from '../utils/success-response';
import { MINUTE } from '../utils/time.constants';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshAuthGuard } from './refresh-auth.guard';
import { UsersService } from '../modules/users/users.service';
import { User } from '../modules/users/entities/user.entity';

// if you don’t already have it, define or import this:
export interface SuccessResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) { }

	@UseGuards(RefreshAuthGuard)
	@Post('refresh')
	async refresh(@Req() req) {
		return this.authService.refreshTokens(req.user);
	}

	@Get('google/login')
	@UseGuards(AuthGuard('google'))
	async googleAuth() { }

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthRedirect(@Req() req) {
		const token = await this.authService.handleGoogleLogin(req.user);
		return successResponse('Google login successful', token);
	}

	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.authService.register(createUserDto);
		return successResponse('Registration successful', user);
	}

	@RateLimit({ windowMs: MINUTE, max: 3 })
	@Post('login')
	async login(@Body() loginDto: LoginDto) {
		const token = await this.authService.login(loginDto);
		return successResponse('Logged in successfully', token);
	}

	@RateLimit({ windowMs: MINUTE, max: 3 })
	@UseGuards(RateLimitGuard, JwtAuthGuard)
	@Post('logout')
	async logout(@Req() req: any) {
		const authHeader = req.headers['authorization'];
		const token = authHeader?.split(' ')[1];
		if (!token) throw new BadRequestException('No token provided');
		await this.authService.logout(token);
		return { success: true, message: 'Logged out successfully' };
	}

	/**
	 * Create a temporary “guest” user and return tokens + recovery code.
	 */
	@Post('guest')
	async guest(): Promise<
		SuccessResponse<{
			access_token: string;
			refresh_token: string;
			recovery_code: string;
		}>
	> {
		// 1) create the temporary user
		const guest: User = await this.usersService.createTemporary();

		// 2) issue JWTs
		const { access_token, refresh_token } = await this.authService.getTokens(
			guest.id,
		);

		// 3) persist & fetch a recovery code
		const recovery_code: string = await this.usersService.setRecoveryCode(
			guest.id,
		);

		// 4) return everything
		return successResponse('Guest session created', {
			access_token,
			refresh_token,
			recovery_code,
		});
	}

	// src/modules/auth/auth.controller.ts
	@Post('recover-guest')
	async recoverGuest(
		@Body('recoveryCode') recoveryCode: string,
	): Promise<SuccessResponse<{
		access_token: string;
		refresh_token: string;
		recovery_code: string;
	}>> {
		// 1) lookup by the old code
		const user = await this.usersService.findByRecoveryCode(recoveryCode);
		if (!user) {
			throw new BadRequestException('Invalid recovery code');
		}

		// 2) issue fresh tokens
		const { access_token, refresh_token } = await this.authService.getTokens(user.id);

		// 3) rotate: generate & persist a brand‑new code
		const newRecoveryCode = await this.usersService.setRecoveryCode(user.id);

		// 4) return tokens + the *new* recovery code
		return successResponse('Guest session recovered', {
			access_token,
			refresh_token,
			recovery_code: newRecoveryCode,
		});
	}

}
