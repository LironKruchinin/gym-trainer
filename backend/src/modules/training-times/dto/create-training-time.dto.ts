import { IsInt, IsOptional, IsObject } from 'class-validator';

export class CreateTrainingTimeDto {
  @IsInt()
  userId: number;

  @IsInt()
  trainingTime: number;

  @IsInt()
  @IsOptional()
  programId?: number;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;
}
