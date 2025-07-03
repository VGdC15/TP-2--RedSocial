import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { AdminGuard } from 'src/auth/guards/admin/admin.guard';


@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @UseGuards(AdminGuard)
  @Get('publicaciones')
  obtenerEstadisticasPublicaciones(@Query('fechaInicio') inicio: string, @Query('fechaFin') fin: string) {
    const resultado = this.estadisticasService.obtenerPublicacionesPorUsuario(inicio, fin);
    return resultado;
  }

  @UseGuards(AdminGuard)
  @Get('comentarios')
  obtenerEstadisticasComentarios(
    @Query('fechaInicio') inicio: string,
    @Query('fechaFin') fin: string
  ) {
    return this.estadisticasService.obtenerCantidadComentarios(inicio, fin);
  }

  @UseGuards(AdminGuard)
  @Get('comentarios-por-publicacion')
  obtenerEstadisticasPorPublicacion(@Query('fechaInicio') inicio: string, @Query('fechaFin') fin: string) {
    const resultado = this.estadisticasService.obtenerComentariosPorPublicacion(inicio, fin);
    return resultado;
  }
}
