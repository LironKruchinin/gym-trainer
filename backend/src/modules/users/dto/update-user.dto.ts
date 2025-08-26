import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @Length(1, 100)
    first_name?: string;

    @IsOptional()
    @Length(1, 200)
    name?: string;

    @IsOptional()
    @Length(1, 100)
    last_name?: string;

    @IsOptional()
    details?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}