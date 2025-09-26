import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
  UseInterceptors, UploadedFile, Req, Headers, Ip, UnauthorizedException, Query } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname, join  } from 'path';
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
      destination: (req, file, cb) => {
        const uploadDir = join(process.cwd(), 'uploads-publicaciones');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
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
  ) {
    const token = auth?.split(' ')[1];
    const usuario = await this.authService.traerDatos(token, ip);

    const baseUrl = process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

    return this.publicacionesService.create({
      imagen: `${baseUrl}/uploads-publicaciones/${imagen.filename}`,
      pieDeFoto,
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
      @Query('limit') limit: string = '10',
      @Query('estado') estado?: string
    ) {
      return this.publicacionesService.listarPublicaciones({
        ordenarPor,
        usuarioId,
        offset: parseInt(offset),
        limit: parseInt(limit),
        estado
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

  @Patch(':id/alta')
  darDeAlta(
    @Param('id') id: string,
    @Headers('Authorization') auth: string,
    @Ip() ip: string
  ) {
    const token = auth?.split(' ')[1];
    const usuario = this.authService.traerDatos(token, ip); 
    return this.publicacionesService.darDeAlta(id, usuario);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionesService.remove(+id);
  }
}
