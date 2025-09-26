import { Body, Controller, Post, UseInterceptors, UploadedFile, Req, Get, 
    Headers, Ip, UnauthorizedException, BadRequestException, UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, File as MulterFile } from 'multer';
import * as fs from 'fs';
import { extname, join } from 'path';
import { AuthGuard } from './auth.guard';

function imageFileFilter(req, file: MulterFile, cb: (error: Error | null, acceptFile: boolean) => void) {
  const allowedTypes = ['image/jpeg', 'image/png'];
  const isValid = allowedTypes.includes(file.mimetype);
  cb(null, isValid); 
}



@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('registro')
    @UseInterceptors(
        FileInterceptor('imagenPerfil', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                const tempDir = join(process.cwd(), 'uploads-temp');
                fs.mkdirSync(tempDir, { recursive: true });
                cb(null, tempDir);
                },
                filename: (req, file: MulterFile, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: imageFileFilter,
        }),

    )
    async register(
    @Req() request: Request,
    @Body() createUsuarioDto: CreateUsuarioDto,
    @UploadedFile() imagen: MulterFile
    ) {
    const ip = request.ip ?? '0.0.0.0';

    if (!imagen) {
        throw new BadRequestException('Solo se permiten archivos JPG y PNG');
    }

    createUsuarioDto.rol = 'usuario';

    const resultado = await this.authService.register(createUsuarioDto, ip, imagen);

    return resultado;
    }


    @Post('login')
    async login(@Req() request: Request, @Body() loginDto: LoginUsuarioDto) {
        const ip = request.ip ?? '0.0.0.0';

        const usuario = await this.authService.validarUsuario(loginDto.email, loginDto.password);
        if (!usuario) {
            throw new UnauthorizedException('Email o contraseña incorrecta');
        }

        const token = this.authService.crearToken(usuario.id, usuario.nombre, ip);

        return {
            mensaje: 'Login correcto',
            usuario,
            token
        };
    }

    @Get('/datos')
    datos(@Headers('Authorization') auth: string, @Ip() ip: string) {
        if (auth) {
        const token = auth?.split(' ')[1];
        return this.authService.traerDatos(token, ip);
        } else {
        return 'No hay header';
        }
    }

    @Post('auth/autorizar') 
    autorizar(@Headers('Authorization') auth: string, @Ip() ip: string) {
        const token = auth?.split(' ')[1];
        if (!token) throw new UnauthorizedException('Token no proporcionado');

        try {
            return this.authService.traerDatos(token, ip);
        } catch (err) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }


    @Get('auth/refresh-token')
    @UseGuards(AuthGuard)
    refrescarToken(@Headers('Authorization') auth: string, @Ip() ip: string) {
    const token = auth?.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token faltante');

    const nuevoToken = this.authService.refrescarToken(token, ip);
    return { token: nuevoToken };
    }

}
