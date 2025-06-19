import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
  UseInterceptors, UploadedFile, Req, Headers, Ip, UnauthorizedException, Query } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from '../auth/auth.service';

@UseGuards(AuthGuard)
@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService,
  private readonly authService: AuthService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads-publicaciones',
      filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
      },
    }),
  }))
  async crearPublicacion(
    @UploadedFile() imagen,
    @Body('pieDeFoto') pieDeFoto: string,
    @Headers('Authorization') auth: string,
    @Ip() ip: string
  ): Promise<any> {
    const token = auth?.split(' ')[1];
    const usuario = await this.authService.traerDatos(token, ip);
    if (!usuario) {
      throw new UnauthorizedException('Token inválido');
    }

    return this.publicacionesService.create({
      imagen: `http://localhost:3000/uploads-publicaciones/${imagen.filename}`,
      pieDeFoto: pieDeFoto,
      usuarioId: usuario.id,
      fecha: new Date()
    });
  }

  @Get('mias')
  getMisPublicaciones(@Headers('Authorization') auth: string, @Ip() ip: string) {
    const token = auth?.split(' ')[1];
    return this.publicacionesService.obtenerUltimasTresDesdeToken(token, ip);
  }

  @Get()
  findAll(
    @Query('ordenarPor') ordenarPor: 'fecha' | 'like' = 'fecha',
    @Query('usuarioId') usuarioId?: string,
    @Query('offset') offset: string = '0',
    @Query('limit') limit: string = '10'
  ) {
    return this.publicacionesService.listarPublicaciones({
      ordenarPor,
      usuarioId,
      offset: parseInt(offset),
      limit: parseInt(limit)
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicacioneDto: UpdatePublicacioneDto) {
    return this.publicacionesService.update(+id, updatePublicacioneDto);
  }

  @Patch(':id/like')
  @UseGuards(AuthGuard)
  async sumarLike(@Param('id') id: string, @Req() req) {
    return await this.publicacionesService.sumarLike(id, req.usuario);
  }

  @Patch(':id/baja')
  darDeBaja(
    @Param('id') id: string,
    @Headers('Authorization') auth: string,
    @Ip() ip: string
  ) {
    const token = auth?.split(' ')[1];
    const usuario = this.authService.traerDatos(token, ip); 

    return this.publicacionesService.bajaLogica(id, usuario);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionesService.remove(+id);
  }
}
