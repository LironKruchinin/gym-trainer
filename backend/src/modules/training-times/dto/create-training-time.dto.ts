import { IsInt, IsOptional, IsDateString, IsObject } from 'class-validator';

export class CreateTrainingTimeDto {
  @IsInt()
  userId: number;

  @IsDateString()
  trainingTime: string;

  @IsInt()
  @IsOptional()
  programId?: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}
