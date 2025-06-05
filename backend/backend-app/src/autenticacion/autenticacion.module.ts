import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';

@Module({
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
})
export class AutenticacionModule {}
