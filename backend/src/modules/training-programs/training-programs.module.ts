import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingProgramsService } from './training-programs.service';
import { TrainingProgramsController } from './training-programs.controller';
import { TrainingProgram } from './entities/training-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingProgram])],
  controllers: [TrainingProgramsController],
  providers: [TrainingProgramsService],
})
export class TrainingProgramsModule { }
