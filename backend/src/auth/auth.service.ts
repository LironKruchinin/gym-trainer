import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { LoginDto } from '../modules/users/dto/login.dto';
import { User } from '../modules/users/entities/user.entity';
import { GoogleUserDto } from './dto/google-user.dto.ts';

import * as bcrypt from 'bcrypt';
import { UsersService } from '../modules/users/users.service';
import { JwtBlacklistService } from './JwtBlacklistService.js';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly jwtBlacklistService: JwtBlacklistService,
		@InjectRepository(User)
		private readonly userRepo: Repository<User>
	) { }

	async handleGoogleLogin(googleUser: GoogleUserDto): Promise<{ token: string }> {
		let user = await this.userRepo.findOneBy({ email: googleUser.email, auth_provider: 'google' });

		if (!user) {
			user = this.userRepo.create({
				...googleUser,
				subscription_status: 'free'
			});
			await this.userRepo.save(user);
		}
		const payload = {
			sub: user.id,
			email: user.email,
		};
		const token = this.jwtService.sign(payload);
		return { token };
	}

	async register(createUserDto: CreateUserDto) {
		try {
			const email = createUserDto.email.trim().toLowerCase();
			const password = createUserDto.password.trim();

			const existingUser = await this.usersService.findByEmail(email);
			if (existingUser) {
				throw new UnauthorizedException('User with this email already exists');
			}

			const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS!, 10));
			const user = await this.usersService.create({
				...createUserDto,
				email,
				password: hashedPassword,
			});

			const payload = { sub: user.id, email: user.email };
			return {
				access_token: this.jwtService.sign(payload),
			};
		} catch (err) {
			throw new UnauthorizedException(err.message || 'Registration failed');
		}
	}


	async login(loginDto: LoginDto) {
		try {
			const email = loginDto.email.trim().toLowerCase();
			const password = loginDto.password.trim();

			const user = await this.usersService.findByEmail(email);
			if (!user || !(await bcrypt.compare(password, user.password))) {
				throw new UnauthorizedException('Invalid email or password');
			}

			const payload = { sub: user.id, email: user.email };
			return {
				access_token: this.jwtService.sign(payload),
			};
		} catch (err) {
			throw new UnauthorizedException(err.message || 'Login failed');
		}
	}

	async logout(token: string) {
		const payload = this.jwtService.decode(token) as any;
		if (!payload?.exp) {
			throw new BadRequestException('Invalid token');
		}
		const expiresAt = new Date(payload.exp * 1000);
		await this.jwtBlacklistService.blacklistToken(token, expiresAt);
	}

	async refreshTokens(user: { userId: number }) {
		// Optionally verify tokenVersion here against DB
		const { access_token } = await this.getTokens(user.userId);
		return { access_token };
	}

	async getTokens(userId: number) {
		const [access, refresh] = await Promise.all([
			this.jwtService.signAsync(
				{ sub: userId },
				{ secret: jwtConstants.accessSecret, expiresIn: '15m' }
			),
			this.jwtService.signAsync(
				{ sub: userId /*, tokenVersion, etc*/ },
				{ secret: jwtConstants.refreshSecret, expiresIn: '7d' }
			),
		]);
		return { access_token: access, refresh_token: refresh };
	}
}