import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraineesService } from './trainees.service';
import { TraineesController } from './trainees.controller';
import { Trainee } from './entities/trainee.entity';
import { TrainingProgram } from '../training-programs/entities/training-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trainee, TrainingProgram])],
  controllers: [TraineesController],
  providers: [TraineesService],
  exports: [TraineesService],
})
export class TraineesModule {}
