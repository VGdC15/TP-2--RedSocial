import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComentarioDto {
  @IsNotEmpty()
  @IsString()
  texto: string;

  @IsNotEmpty()
  @IsString()
  publicacionId: string;
}
