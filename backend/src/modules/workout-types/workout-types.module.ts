import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutTypesService } from './workout-types.service';
import { WorkoutTypesController } from './workout-types.controller';
import { WorkoutType } from './entities/workout-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutType])],
  controllers: [WorkoutTypesController],
  providers: [WorkoutTypesService],
})
export class WorkoutTypesModule { }
