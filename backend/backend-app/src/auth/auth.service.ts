import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
import { File as MulterFile } from 'multer';
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken/index';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

@Injectable()
export class AuthService {
    constructor(private readonly usuariosService: UsuariosService) {}

    async register(createUsuarioDto: CreateUsuarioDto, ip: string, imagen: MulterFile) {
        const rename = promisify(fs.rename);
        const existenteEmail = await this.usuariosService.findByEmail(createUsuarioDto.email);
        if (existenteEmail) {
            if (imagen) fs.unlinkSync(imagen.path);
            throw new BadRequestException('El email ya está registrado');
        }

        const existenteUsuario = await this.usuariosService.findByUsuario(createUsuarioDto.usuario);
        if (existenteUsuario) {
            if (imagen) fs.unlinkSync(imagen.path);
            throw new BadRequestException('El usuario ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
        createUsuarioDto.password = hashedPassword;

        if (imagen) {
            const destino = path.join('./uploads', imagen.filename);
            await rename(imagen.path, destino);
            createUsuarioDto.imagenPerfil = `http://localhost:3000/uploads/${imagen.filename}`;
        }

        const nuevoUsuario = await this.usuariosService.create(createUsuarioDto);
        const token = this.crearToken(nuevoUsuario.id, nuevoUsuario.nombre, ip);

        return {
            usuario: nuevoUsuario,
            token,
        };
    }

    async login(loginDto: LoginUsuarioDto, ip: string) {
        const usuario = await this.validarUsuario(loginDto.email, loginDto.password);
        if (!usuario) {
            throw new BadRequestException('Email o contraseña incorrecta');
        }

        const token = this.crearToken(usuario.id, usuario.nombre, ip);

        return {
            mensaje: 'Login correcto',
            usuario,
            token,
        };
    }

    async validarUsuario(email: string, password: string) {
        const usuario = await this.usuariosService.findByEmailOrUsuario(email, '');
        if (!usuario) return null;

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) return null;

        return usuario;
    }

    async traerDatos(token: string, ip: string) {
        const clave = process.env.CLAVE_TOKEN;
        try {
            const payload: any = verify(token, ip + clave);
            const usuarioCompleto = await this.usuariosService.findOne(payload.id);

            if (!usuarioCompleto || usuarioCompleto.rol !== 'admin') {
            throw new UnauthorizedException('Acceso restringido a administradores');
            }

            return usuarioCompleto;
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }


    crearToken(id, nombre, ip) {
        const payload = {
        id: id,
        nombre: nombre,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        };

        const clave = process.env.CLAVE_TOKEN;

        return sign(payload, ip + clave, {
        algorithm: 'HS256',
        });
    }

    refrescarToken(token: string, ip: string): string {
        const clave = process.env.CLAVE_TOKEN;
        try {
            const payload: any = verify(token, ip + clave);
            delete payload.iat;
            delete payload.exp;
            return this.crearToken(payload.id, payload.nombre, ip);
        } catch (error) {
            console.error('Token inválido o expirado');
            throw new Error('Token inválido o expirado');
        }
    }

}