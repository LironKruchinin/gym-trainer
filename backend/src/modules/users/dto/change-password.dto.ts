import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty()
    old_password: string;

    @IsNotEmpty()
    @IsString()
    new_password: string;

    @IsNotEmpty()
    @IsString()
    confirm_new_password: string;
}
