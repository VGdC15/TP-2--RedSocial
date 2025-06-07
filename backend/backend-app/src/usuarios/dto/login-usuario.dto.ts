import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUsuarioDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

