import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar archivos  desde la carpeta 'uploads' para fotos de perfil
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // carpeta 'uploads-publicaciones' para publicaciones
  app.useStaticAssets(join(__dirname, '..', 'uploads-publicaciones'), {
    prefix: '/uploads-publicaciones',
  });

  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  app.enableCors(); //Habilitar CORS para todas las rutas
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
