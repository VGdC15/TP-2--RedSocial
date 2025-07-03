import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { AuthGuard } from 'src/auth/auth.guard'; 

@UseGuards(AuthGuard)
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones')
  obtenerEstadisticasPublicaciones(@Query('fechaInicio') inicio: string, @Query('fechaFin') fin: string) {
    const resultado = this.estadisticasService.obtenerPublicacionesPorUsuario(inicio, fin);
    return resultado;
  }

  @Get('comentarios')
  obtenerEstadisticasComentarios(
    @Query('fechaInicio') inicio: string,
    @Query('fechaFin') fin: string
  ) {
    return this.estadisticasService.obtenerCantidadComentarios(inicio, fin);
  }

  @Get('comentarios-por-publicacion')
  obtenerEstadisticasPorPublicacion(@Query('fechaInicio') inicio: string, @Query('fechaFin') fin: string) {
    const resultado = this.estadisticasService.obtenerComentariosPorPublicacion(inicio, fin);
    return resultado;
  }
}
