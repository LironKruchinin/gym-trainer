import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UsersModule } from '../modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtBlacklistService } from './JwtBlacklistService';
import { JwtStrategy } from './JwtStrategy';
import { jwtConstants } from './constants';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.accessSecret,
			signOptions: { expiresIn: '1d' },
		}),
		// refresh‑token strategy
		JwtModule.register({
			secret: jwtConstants.refreshSecret,
			signOptions: { expiresIn: '4d' },
		}),
		TypeOrmModule.forFeature([User]),
		UsersModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		JwtAuthGuard,
		JwtBlacklistService,
	],
	exports: [JwtBlacklistService],
})
export class AuthModule { }
