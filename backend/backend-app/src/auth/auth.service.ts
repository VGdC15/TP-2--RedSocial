import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken/index';

@Injectable()
export class AuthService {
    constructor(private readonly usuariosService: UsuariosService) {}

    async register(createUsuarioDto: CreateUsuarioDto, ip: string) {
        const existente = await this.usuariosService.findByEmailOrUsuario(
        createUsuarioDto.email,
        createUsuarioDto.usuario,
        );

        if (existente) {
            throw new BadRequestException('El email ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
        createUsuarioDto.password = hashedPassword;

        const nuevoUsuario = await this.usuariosService.create(createUsuarioDto);

        const token = this.crearToken(nuevoUsuario.id, nuevoUsuario.nombre, ip);

        return {
            usuario: nuevoUsuario,
            token,
        };
    }

    async login(loginDto: LoginUsuarioDto, ip: string) {
        const usuario = await this.usuariosService.findByEmailOrUsuario(
        loginDto.email,
        '',
        );

        if (!usuario) {
            throw new BadRequestException('Email o contraseña incorrecta');
        }

        const match = await bcrypt.compare(loginDto.password, usuario.password);

        if (!match) {
            throw new BadRequestException('Email o contraseña incorrecta');
        }

        const token = this.crearToken(usuario.id, usuario.nombre, ip);

        return {
            usuario,
            token,
        };
    }

    traerDatos(token, ip) {
        const clave = process.env.CLAVE_TOKEN;
        try {
            const payload = verify(token, ip + clave);
            return payload;
        } catch (error) {
            console.error(error);
            throw new Error('Token inválido o expirado');
        }
    }


    crearToken(id, nombre, ip) {
        const payload = {
        id: id,
        nombre: nombre,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60, 
        };

        const clave = process.env.CLAVE_TOKEN;

        return sign(payload, ip + clave, {
        algorithm: 'HS256',
        });
    }

    // refrescarToken(token){
    //     try{
    //         const payload = verify(token,"asd");
    //         payload.exp = Date.now() / 1000 * 15 * 60;
    //         const token = sing(payload)
    //     } catch(e){}
        
    // }

}