import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('comentarios') 
@UseGuards(AuthGuard)
export class ComentariosController {
  constructor(private readonly cs: ComentariosService, private readonly auth: AuthService) {}

  @Post()
  create(@Body() dto: CreateComentarioDto, @Req() req) {
    console.log('DTO recibido en controlador:', dto);
    const usuario = req.usuario;
    return this.cs.create(dto, usuario.id).then(comentario => ({
      mensaje: 'Comentario creado correctamente',
      comentario,
    }));
  }

  @Get('/publicacion/:id')
  async findByPublicacion(
    @Param('id') id: string,
    @Req() req
  ): Promise<{ comentarios: any[] }> {
    const rawOffset = req.query.offset;
    const rawLimit = req.query.limit;

    const offset = Number.isInteger(+rawOffset) ? parseInt(rawOffset) : 0;
    const limit = Number.isInteger(+rawLimit) ? parseInt(rawLimit) : 2;

    const comentarios = await this.cs.findByPublicacion(id, offset, limit);

    return { comentarios };
  }
 
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateComentarioDto,
    @Req() req
  ): Promise<{ mensaje: string; comentario: any }> {
    const usuario = req.usuario;
    return this.cs.update(id, dto, usuario.id).then(comentario => {
      return {
        mensaje: 'Comentario actualizado',
        comentario,
      };
    });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req
  ): Promise<{ mensaje: string; id: string }> {
    const usuario = req.usuario;
    return this.cs.remove(id, usuario.id).then(() => {
      return {
        mensaje: 'Comentario eliminado',
        id,
      };
    });
  }
}
