import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginUsuarioDto } from '../usuarios/dto/login-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usuariosService: UsuariosService) {}

    async register(createUsuarioDto: CreateUsuarioDto) {
        const existente = await this.usuariosService.findByEmailOrUsuario(
        createUsuarioDto.email,
        createUsuarioDto.usuario,
        );

        if (existente) {
        throw new BadRequestException('El email o nombre de usuario ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
        createUsuarioDto.password = hashedPassword;

        return await this.usuariosService.create(createUsuarioDto);
    }

    async login(loginDto: LoginUsuarioDto) {
        const usuario = await this.usuariosService.findByEmailOrUsuario(loginDto.email, '');

        if (!usuario) {
            throw new BadRequestException('Credenciales incorrectas');
        }

        const match = await bcrypt.compare(loginDto.password, usuario.password);

        if (!match) {
            throw new BadRequestException('Credenciales incorrectas');
        }

        return usuario;
    }


}