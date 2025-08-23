import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutTypesController } from './workout-types.controller';
import { WorkoutTypesService } from './workout-types.service';

describe('WorkoutTypesController', () => {
  let controller: WorkoutTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutTypesController],
      providers: [WorkoutTypesService],
    }).compile();

    controller = module.get<WorkoutTypesController>(WorkoutTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
