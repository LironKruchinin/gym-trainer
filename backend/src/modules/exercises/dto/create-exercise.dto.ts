import { IsEnum, IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { ExerciseCategory } from '../entities/exercise.entity';

export class CreateExerciseDto {
    @IsString()
    name: string;

    @IsEnum(['cardio', 'strength', 'olympic', 'gymnastics', 'accessory'])
    category: ExerciseCategory;

    @IsOptional() @IsNumber()
    wgerId?: number;

    @IsOptional() @IsString()
    equipment?: string;

    @IsOptional() @IsString()
    description?: string;

    @IsOptional() @IsArray()
    @IsString({ each: true })
    scalingOptions?: string[];
}
