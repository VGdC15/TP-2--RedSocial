import { Body, Controller, Post, UseInterceptors, UploadedFile, Req, Get, Headers, Ip } from '@nestjs/common';
import { Request } from 'express';
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
        @Req() request: Request,
        @Body() createUsuarioDto: CreateUsuarioDto,
        @UploadedFile() imagen: MulterFile
    ) {
        if (imagen) {
        createUsuarioDto.imagenPerfil = `http://localhost:3000/uploads/${imagen.filename}`;
        }

        const ip = request.ip ?? '0.0.0.0';;

        createUsuarioDto.estado = true;

        return await this.authService.register(createUsuarioDto, ip);
    }

    @Post('login')
    async login(@Req() request: Request, @Body() loginDto: LoginUsuarioDto) {
        const ip = request.ip ?? '0.0.0.0';;
        return await this.authService.login(loginDto, ip);
    }

    @Get('datos')
    datos(@Headers('Authorization') auth: string, @Ip() ip: string) {
        if (auth) {
        const token = auth?.split(' ')[1];
        return this.authService.traerDatos(token, ip);
        } else {
        return 'No hay header';
        }
    }
}
