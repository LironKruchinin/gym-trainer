import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutTypeDto } from './create-workout-type.dto';

export class UpdateWorkoutTypeDto extends PartialType(CreateWorkoutTypeDto) {}
