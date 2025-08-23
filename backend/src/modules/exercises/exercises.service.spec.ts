import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { Exercise } from './entities/exercise.entity';
import { ExerciseTranslation } from './entities/exercise-translation.entity';
import { ExerciseInfo } from './entities/exercise-info.entity';
import { ExerciseVideo } from './entities/exercise-video.entity';
import { Muscle } from './entities/muscle.entity';

describe('ExercisesService', () => {
  let service: ExercisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        { provide: getRepositoryToken(Exercise), useValue: {} },
        { provide: getRepositoryToken(ExerciseTranslation), useValue: {} },
        { provide: getRepositoryToken(ExerciseInfo), useValue: {} },
        { provide: getRepositoryToken(ExerciseVideo), useValue: {} },
        { provide: getRepositoryToken(Muscle), useValue: {} },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
