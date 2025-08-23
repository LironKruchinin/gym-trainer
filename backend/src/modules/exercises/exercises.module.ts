import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { Exercise } from './entities/exercise.entity';
import { ExerciseTranslation } from './entities/exercise-translation.entity';
import { ExerciseInfo } from './entities/exercise-info.entity';
import { ExerciseVideo } from './entities/exercise-video.entity';
import { Muscle } from './entities/muscle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, ExerciseTranslation, ExerciseInfo, ExerciseVideo, Muscle]),
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}
