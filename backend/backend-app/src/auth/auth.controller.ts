import { Body, Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, File as MulterFile } from 'multer';
import { extname } from 'path';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('registro')
    @UseInterceptors(
        FileInterceptor('imagenPerfil', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file: MulterFile, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        })
    )
    async register(
        @Body() createUsuarioDto: CreateUsuarioDto,
        @UploadedFile() imagen: MulterFile
    ) {
        if (imagen) {
        createUsuarioDto.imagenPerfil = `http://localhost:3000/uploads/${imagen.filename}`;
        }

        return await this.authService.register(createUsuarioDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginUsuarioDto) {
        return await this.authService.login(loginDto);
    }
}
