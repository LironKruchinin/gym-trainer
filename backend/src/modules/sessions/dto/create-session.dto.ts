import { IsArray, IsInt, IsString, Matches } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/)
  start_time: string;

  @IsArray()
  @IsInt({ each: true })
  trainee_ids: number[];
}
