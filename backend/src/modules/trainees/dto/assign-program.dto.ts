import { IsInt } from 'class-validator';

export class AssignProgramDto {
  @IsInt()
  programId: number;
}
