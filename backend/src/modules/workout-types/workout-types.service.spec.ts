import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutTypesService } from './workout-types.service';

describe('WorkoutTypesService', () => {
  let service: WorkoutTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutTypesService],
    }).compile();

    service = module.get<WorkoutTypesService>(WorkoutTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
