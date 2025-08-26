import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @Length(2, 100)
    @IsString()
    first_name: string;

    @IsOptional()
    @Length(1, 200)
    @IsString()
    name?: string;

    @Length(2, 100)
    @IsOptional()
    @IsString()
    last_name: string;

    @IsOptional()
    @IsString()
    details?: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
