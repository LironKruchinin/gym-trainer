import { IsString, IsISO8601, IsOptional, IsInt } from 'class-validator';

export class CreateTraineeDto {
  @IsString()
  name: string;

  @IsISO8601()
  reservedTime: string;

  @IsOptional()
  @IsInt()
  programId?: number;
}
