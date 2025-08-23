import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingLogsService } from './training-logs.service';
import { TrainingLogsController } from './training-logs.controller';
import { TrainingLog } from './entities/training-log.entity';
import { Trainee } from '../trainees/entities/trainee.entity';
import { TrainingProgram } from '../training-programs/entities/training-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingLog, Trainee, TrainingProgram])],
  controllers: [TrainingLogsController],
  providers: [TrainingLogsService],
})
export class TrainingLogsModule {}
