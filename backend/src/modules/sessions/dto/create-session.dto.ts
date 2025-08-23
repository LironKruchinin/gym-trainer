import { IsArray, IsDateString, IsInt } from 'class-validator';

export class CreateSessionDto {
  @IsDateString()
  start_time: string;

  @IsArray()
  @IsInt({ each: true })
  trainee_ids: number[];
}
