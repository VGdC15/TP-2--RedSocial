import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('registro')
    async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return await this.authService.register(createUsuarioDto);
    }

}


