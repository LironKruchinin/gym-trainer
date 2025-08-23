import { Test, TestingModule } from '@nestjs/testing';
import { TrainingProgramsController } from './training-programs.controller';
import { TrainingProgramsService } from './training-programs.service';

describe('TrainingProgramsController', () => {
  let controller: TrainingProgramsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingProgramsController],
      providers: [{ provide: TrainingProgramsService, useValue: {} }],
    }).compile();

    controller = module.get<TrainingProgramsController>(TrainingProgramsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
