import { IsString, IsOptional } from 'class-validator';

export class CreateWorkoutTypeDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
