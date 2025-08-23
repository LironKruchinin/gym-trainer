import {
    IsString,
    IsEnum,
    IsOptional,
    IsArray,
    ValidateNested,
    IsBoolean,
    IsInt,
    Min,
    Max,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProgramExerciseDto {
    @IsString() name: string;
    @Type(() => Number)
    @IsInt({ message: 'sets must be a number' })
    @Min(1)
    @Max(10)
    sets: number;
    @IsString() reps: string;
    @IsString() weight: string;
    @IsOptional() @IsString() notes?: string;
}

export class CreateTrainingProgramDto {
    @IsString() name: string;

    @IsOptional() @IsString() description?: string;

    @IsEnum(['beginner', 'intermediate', 'advanced'])
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProgramExerciseDto)
    exercises?: ProgramExerciseDto[];

    @IsString() workoutType: string;

    @IsOptional() @IsString() timeCap?: string;

    @IsOptional() @IsBoolean() isTemplate?: boolean;
}
