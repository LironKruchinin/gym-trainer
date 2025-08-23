import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { successResponse } from '../../utils/success-response';

describe('UsersController', () => {
  let controller: UsersController;
  let svc: { create: jest.Mock };

  beforeEach(async () => {
    svc = { create: jest.fn() } as any;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: svc }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delegates to service and wraps response', async () => {
    svc.create.mockResolvedValue({ id: 1 });
    const result = await controller.create({} as any);
    expect(svc.create).toHaveBeenCalled();
    expect(result).toEqual(successResponse('User created successfully', { id: 1 }));
  });
});
