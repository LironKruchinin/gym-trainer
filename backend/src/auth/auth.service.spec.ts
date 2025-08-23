import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;
  let jwtBlacklist: any;
  let userRepo: any;

  beforeEach(() => {
    usersService = { findByEmail: jest.fn(), create: jest.fn() };
    jwtService = { sign: jest.fn().mockReturnValue('token') };
    jwtBlacklist = { blacklistToken: jest.fn(), isTokenBlacklisted: jest.fn().mockResolvedValue(false) };
    userRepo = { findOneBy: jest.fn(), create: jest.fn(), save: jest.fn() };
    service = new AuthService(jwtService, usersService, jwtBlacklist, userRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('fails login with invalid credentials', async () => {
    const hash = await bcrypt.hash('Password1', 10);
    usersService.findByEmail.mockResolvedValue({ id: 1, email: 'john@example.com', password: hash });
    await expect(service.login({ email: 'john@example.com', password: 'wrong' } as any)).rejects.toThrow(UnauthorizedException);
  });

  it('sanitizes email input', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    const injection = "john@example.com' OR 1=1 --  ";
    await expect(service.login({ email: injection, password: 'pwd' } as any)).rejects.toThrow(UnauthorizedException);
    expect(usersService.findByEmail).toHaveBeenCalledWith("john@example.com' or 1=1 --".trim().toLowerCase());
  });

  it('register rejects existing email', async () => {
    usersService.findByEmail.mockResolvedValue({ id: 5 });
    await expect(
      service.register({ email: 'x@x', password: 'p', first_name: 'a', last_name: 'b' } as any),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
