import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkoutTypesService } from './workout-types.service';
import { WorkoutType } from './entities/workout-type.entity';

describe('WorkoutTypesService', () => {
  let service: WorkoutTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutTypesService,
        { provide: getRepositoryToken(WorkoutType), useValue: {} },
      ],
    }).compile();

    service = module.get<WorkoutTypesService>(WorkoutTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
