import { Module } from '@nestjs/common';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from 'src/comentarios/entities/comentario.entity';
import { Publicacione, PublicacioneSchema } from 'src/publicaciones/entities/publicacione.entity';
import { AdminGuard } from 'src/auth/guards/admin/admin.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ AuthModule,
    MongooseModule.forFeature([
      { name: 'Comentario', schema: ComentarioSchema },
      { name: 'Publicacione', schema: PublicacioneSchema },
    ])
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService, AdminGuard]
})
export class EstadisticasModule {}
