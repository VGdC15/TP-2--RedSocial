import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No se encontró el header de autorización');
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const clave = process.env.CLAVE_TOKEN;
      const ip = request.ip ?? '0.0.0.0';
      const payload = verify(token, ip + clave);
      request['usuario'] = payload; 
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}

