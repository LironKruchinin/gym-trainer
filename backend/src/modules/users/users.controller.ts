import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	Patch,
	Post,
	Req,
	UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { successResponse } from '../../utils/success-response';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@UseGuards(JwtAuthGuard)
	@Patch('change-password')
	async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
		const userId = req.user?.userId;
		if (!userId) throw new BadRequestException('Invalid user context');

		const result = await this.usersService.changePassword(userId, dto);
		return successResponse(result.message);
	}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		try {
			const user = await this.usersService.create(createUserDto);
			return successResponse('User created successfully', user);
		} catch (err) {
			throw new BadRequestException(err.message || 'Failed to create user');
		}
	}

	@Get()
	async findAll() {
		try {
			const users = await this.usersService.findAll();
			return successResponse('Users fetched successfully', users);
		} catch (err) {
			throw new InternalServerErrorException('Failed to fetch users');
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		try {
			const user = await this.usersService.findOne(+id);
			return successResponse('User fetched successfully', user);
		} catch (err) {
			throw new NotFoundException(err.message || `User with id ${id} not found`);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		try {
			const updatedUser = await this.usersService.update(+id, updateUserDto);
			return successResponse('User updated successfully', updatedUser);
		} catch (err) {
			throw new BadRequestException(err.message || 'Failed to update user');
		}
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		try {
			await this.usersService.remove(+id);
			return successResponse(`User ${id} deleted successfully`);
		} catch (err) {
			throw new NotFoundException(err.message || 'User not found or cannot be deleted');
		}
	}

}
