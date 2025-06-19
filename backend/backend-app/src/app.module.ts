import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Comentario, ComentarioSchema } from './comentarios/entities/comentario.entity';
import { ComentariosService } from './comentarios/comentarios.service';
import { ComentariosController } from './comentarios/comentarios.controller';

@Module({
  imports: [PublicacionesModule, AuthModule, UsuariosModule, ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    MongooseModule.forFeature([{ name: Comentario.name, schema: ComentarioSchema }]),
    AuthModule],
  controllers: [AppController, ComentariosController],
  providers: [AppService, ComentariosService],
})
export class AppModule {}

