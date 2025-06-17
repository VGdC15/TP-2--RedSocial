import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacione, PublicacioneSchema } from '../publicaciones/entities/publicacione.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
    MongooseModule.forFeature([
      { name: Publicacione.name, schema: PublicacioneSchema }
    ]),
    AuthModule 
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}
