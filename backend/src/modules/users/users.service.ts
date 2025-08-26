import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,
	) { }

        async create(createUserDto: CreateUserDto): Promise<User> {
                try {
                        const user = this.userRepository.create({
                                first_name: createUserDto.first_name,
                                last_name: createUserDto.last_name,
                                name: createUserDto.name,
                                details: createUserDto.details,
                                email: createUserDto.email,
                                password: createUserDto.password,
                        });

			const basic = await this.roleRepository.findOneBy({ name: 'basic' });
			if (!basic) throw new NotFoundException('Role "basic" not found');
			user.roles = [basic];

			return await this.userRepository.save(user);
		} catch (err) {
			if (err.code === '23505') {
				throw new BadRequestException('Email already exists');
			}
			throw new InternalServerErrorException('Failed to create user');
		}
	}

	async findAll(): Promise<User[]> {
		try {
			return await this.userRepository.find();
		} catch (err) {
			throw new InternalServerErrorException('Failed to fetch users');
		}
	}

	async findOne(id: number): Promise<User> {
		try {
			const user = await this.userRepository.findOneBy({ id });
			if (!user) {
				throw new NotFoundException(`User with id ${id} not found`);
			}
			return user;
		} catch (err) {
			if (err instanceof NotFoundException) throw err;
			throw new InternalServerErrorException('Failed to fetch user');
		}
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		try {
                        const result = await this.userRepository.update(id, {
                                first_name: updateUserDto.first_name,
                                last_name: updateUserDto.last_name,
                                name: updateUserDto.name,
                                details: updateUserDto.details,
                                email: updateUserDto.email,
                        });

			if (result.affected === 0) {
				throw new NotFoundException(`User with id ${id} not found`);
			}

			return this.findOne(id);
		} catch (err) {
			if (err instanceof NotFoundException) throw err;
			if (err.code === '23505') {
				throw new BadRequestException('Email already exists');
			}
			throw new InternalServerErrorException('Failed to update user');
		}
	}

	async remove(id: number): Promise<void> {
		try {
			const result = await this.userRepository.delete(id);
			if (result.affected === 0) {
				throw new NotFoundException(`User with id ${id} not found`);
			}
		} catch (err) {
			if (err instanceof NotFoundException) throw err;
			throw new InternalServerErrorException('Failed to delete user');
		}
	}

	async findByEmail(email: string): Promise<User | null> {
		return await this.userRepository.findOneBy({ email });
	}

	async changePassword(userId: number, dto: ChangePasswordDto) {
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user) throw new NotFoundException('User not found');

		if (!user.email && !user.phone_num) {
			throw new BadRequestException('Email or phone must be verified before changing password');
		}

		const passwordMatch = await bcrypt.compare(dto.old_password, user.password);
		if (!passwordMatch) throw new BadRequestException('Old password is incorrect');

		if (dto.new_password !== dto.confirm_new_password)
			throw new BadRequestException('New passwords do not match');

		if (await bcrypt.compare(dto.new_password, user.password))
			throw new BadRequestException('New password must be different from old one');

		const hashedNewPassword = await bcrypt.hash(dto.new_password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'));
		user.password = hashedNewPassword;
		await this.userRepository.save(user);

		return { success: true, message: 'Password changed successfully' };
	}

	async assignRole(userId: number, roleName: string): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['roles'],
		});
		if (!user) throw new NotFoundException('User not found');

		const role = await this.roleRepository.findOneBy({ name: roleName });
		if (!role) throw new NotFoundException(`Role "${roleName}" not found`);

		// avoid duplicates
		if (!user.roles.some(r => r.id === role.id)) {
			user.roles.push(role);
			await this.userRepository.save(user);
		}
		return user;
	}

	/**
	 * Create a “guest” user with a generated first_name
	 * of the form `${timestamp}-${randomChars}` and assign the
	 * ROLE named "guest" (falling back to "basic" if missing).
	 */
	async createTemporary(): Promise<User> {
		const ts = Date.now();
		const rand = Math.random().toString(36).substring(2, 8);
		const firstName = `${ts}-${rand}`;

		const guestRole = await this.roleRepository.findOneBy({ name: 'guest' });
		if (!guestRole) {
			throw new NotFoundException('Role "guest" not found');
		}

		const user = this.userRepository.create({
			first_name: firstName,
			// no email/password
			roles: [guestRole],
		});

		try {
			return await this.userRepository.save(user);
		} catch (err) {
			throw new InternalServerErrorException('Failed to create temporary user');
		}
	}

	/** Generate, persist, and return a one‑time recovery code for an existing user */
	async setRecoveryCode(userId: number): Promise<string> {
		// generate an 8‑char alphanumeric code
		const code = Math.random().toString(36).slice(2, 10);

		const result = await this.userRepository.update(userId, {
			recovery_code: code,
		});
		if (result.affected === 0) {
			throw new NotFoundException(`User with id ${userId} not found`);
		}

		return code;
	}

	async findByRecoveryCode(code: string): Promise<User | null> {
		return this.userRepository.findOne({
			where: { recovery_code: code },
			relations: ['roles'],
		});
	}

	/** Clear a one‑time recovery code (so it can’t be reused) */
	async clearRecoveryCode(userId: number): Promise<void> {
		await this.userRepository.update(userId, { recovery_code: null });
	}
}

