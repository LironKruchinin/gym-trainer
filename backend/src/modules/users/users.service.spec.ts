import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';

import { ObjectLiteral } from 'typeorm';

function repoMock<T extends ObjectLiteral>() {
	return {
		create: jest.fn(),
		save: jest.fn(),
		find: jest.fn(),
		findOneBy: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	} as unknown as jest.Mocked<Repository<T>>;
}

describe('UsersService', () => {
        let service: UsersService;
        let repo: jest.Mocked<Repository<any>>;
        let roleRepo: jest.Mocked<Repository<any>>;

        beforeEach(() => {
                repo = repoMock();
                roleRepo = repoMock();
                roleRepo.findOneBy.mockResolvedValue({ id: 1 } as any);
                service = new UsersService(repo as any, roleRepo as any);
        });

	it('create throws if duplicate email', async () => {
		repo.create.mockReturnValue({} as any);
		repo.save.mockRejectedValue({ code: '23505' });
		await expect(service.create({} as any)).rejects.toBeInstanceOf(BadRequestException);
	});

	it('findOne throws when not found', async () => {
		repo.findOneBy.mockResolvedValue(null);
		await expect(service.findOne(1)).rejects.toBeInstanceOf(NotFoundException);
	});
});