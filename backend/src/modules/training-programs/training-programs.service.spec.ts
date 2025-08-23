import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrainingProgramsService } from './training-programs.service';
import { TrainingProgram } from './entities/training-program.entity';

describe('TrainingProgramsService', () => {
  let service: TrainingProgramsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingProgramsService,
        { provide: getRepositoryToken(TrainingProgram), useValue: {} },
      ],
    }).compile();

    service = module.get<TrainingProgramsService>(TrainingProgramsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
