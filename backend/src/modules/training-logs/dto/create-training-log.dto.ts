import { IsInt, IsOptional } from 'class-validator';

export class CreateTrainingLogDto {
  @IsInt()
  traineeId: number;

  @IsInt()
  programId: number;

  @IsOptional()
  details?: any;
}
