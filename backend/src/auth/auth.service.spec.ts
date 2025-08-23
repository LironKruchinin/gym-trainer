import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtBlacklistService } from './JwtBlacklistService';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
	let service: AuthService;
	let usersService: { findByEmail: jest.Mock };
	let jwtService: { sign: jest.Mock };

	beforeEach(async () => {
		usersService = { findByEmail: jest.fn() };
		jwtService = { sign: jest.fn().mockReturnValue('token') } as any;
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: UsersService, useValue: usersService },
				{ provide: JwtService, useValue: jwtService },
				{ provide: JwtBlacklistService, useValue: { blacklistToken: jest.fn() } },
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('fails login with invalid credentials', async () => {
		const hash = await bcrypt.hash('Password1', 10);
		usersService.findByEmail.mockResolvedValue({ id: 1, email: 'john@example.com', password: hash });
		await expect(service.login({ email: 'john@example.com', password: 'wrong' })).rejects.toThrow(UnauthorizedException);
	});

	it('sanitizes email input', async () => {
		usersService.findByEmail.mockResolvedValue(null);
		const injection = "john@example.com' OR 1=1 --  ";
		await expect(service.login({ email: injection, password: 'pwd' })).rejects.toThrow(UnauthorizedException);
		expect(usersService.findByEmail).toHaveBeenCalledWith("john@example.com' or 1=1 --".trim().toLowerCase());
	});

	it('register rejects existing email', async () => {
		usersService.findByEmail.mockResolvedValue({ id: 5 });
		await expect(
			service.register({ email: 'x@x', password: 'p', first_name: 'a', last_name: 'b' } as any),
		).rejects.toBeInstanceOf(UnauthorizedException);
	});
});