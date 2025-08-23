import { ItemsService } from './items.service';
import { successResponse } from 'src/utils/success-response';
import { NotFoundException } from '@nestjs/common';

describe('ItemsController', () => {
	let controller: ItemsController;
	let service: jest.Mocked<ItemsService>;

	beforeEach(() => {
		service = {
			create: jest.fn(),
			findAll: jest.fn(),
			findOne: jest.fn(),
			update: jest.fn(),
			remove: jest.fn(),
			findByUser: jest.fn(),
		} as any;
		controller = new ItemsController(service);
	});

	it('create wraps service result', async () => {
		service.create.mockResolvedValue({ id: 1 });
		const dto = { title: 't' } as any;
		const res = await controller.create(dto);
		expect(service.create).toHaveBeenCalledWith(dto);
		expect(res).toEqual(successResponse('Item created', { id: 1 }));
	});

	it('findMyItems uses logged user', async () => {
		service.findByUser.mockResolvedValue([{ id: 2 } as any]);
		const req = { user: { userId: 5 } };
		const res = await controller.findMyItems(req as any);
		expect(service.findByUser).toHaveBeenCalledWith(5);
		expect(res).toEqual(successResponse('Your items fetched', [{ id: 2 }]));
	});

	it('findOne rethrows not found', async () => {
		service.findOne.mockRejectedValue(new NotFoundException());
		await expect(controller.findOne('3')).rejects.toBeInstanceOf(NotFoundException);
	});
});