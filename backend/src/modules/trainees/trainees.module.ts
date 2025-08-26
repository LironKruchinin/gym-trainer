import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraineesService } from './trainees.service';
import { TraineesController } from './trainees.controller';
import { TraineeGetController } from './trainee-get.controller';
import { Trainee } from './entities/trainee.entity';
import { TrainingProgram } from '../training-programs/entities/training-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trainee, TrainingProgram])],
  controllers: [TraineesController, TraineeGetController],
  providers: [TraineesService],
  exports: [TraineesService],
})
export class TraineesModule {}
