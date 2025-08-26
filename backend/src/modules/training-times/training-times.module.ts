import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingTimesService } from './training-times.service';
import { TrainingTimesController } from './training-times.controller';
import { TrainingTime } from './entities/training-time.entity';
import { User } from '../users/entities/user.entity';
import { TrainingProgram } from '../training-programs/entities/training-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingTime, User, TrainingProgram])],
  controllers: [TrainingTimesController],
  providers: [TrainingTimesService],
})
export class TrainingTimesModule {}
