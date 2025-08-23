import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { ExerciseCategory } from '../entities/exercise.entity';

export class CreateExerciseDto {
    @IsString()
    name: string;

    @IsEnum(['cardio', 'strength', 'olympic', 'gymnastics', 'accessory'])
    category: ExerciseCategory;

    @IsOptional() @IsString()
    equipment?: string;

    @IsOptional() @IsString()
    description?: string;

    @IsOptional() @IsArray()
    @IsString({ each: true })
    scalingOptions?: string[];
}
