import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class CreateUsuarioDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;
    
    @IsNotEmpty()
    @IsString()
    apellido: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    usuario: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    fechaNacimiento: Date;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @Type(() => Boolean)
    @IsBoolean()
    estado: boolean;
    
}