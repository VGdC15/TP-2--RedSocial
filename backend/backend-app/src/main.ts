import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1) Asegurar que existan las carpetas de subida (Render no sube carpetas vacías)
  const uploadDirs = [
    join(__dirname, '..', 'uploads'),
    join(__dirname, '..', 'uploads-publicaciones'),
    join(__dirname, '..', 'uploads-temp'),
  ];
  for (const dir of uploadDirs) {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.error(`No se pudo crear el directorio ${dir}`, e);
    }
  }

  // 2) Servir estáticos de perfil y publicaciones
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads-publicaciones'), {
    prefix: '/uploads-publicaciones',
  });

  // 3) Validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // 4) CORS (simple para todos los orígenes; si querés, después lo afinamos)
  app.enableCors();

  // 5) Arrancar
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 API escuchando en puerto ${port}`);
}

bootstrap();
