import { IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ProgramExerciseDto {
    @IsString() name: string;
    @IsEnum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], { each: false, message: 'sets must be a number' })
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
