import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { Publicacione } from './entities/publicacione.entity';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PublicacionesService {
  constructor(
  @InjectModel(Publicacione.name)
  private publicacionModel: Model<Publicacione>,
  private readonly authService: AuthService
) {}

  async create(data: {
    imagen: string;
    pieDeFoto: string;
    usuarioId: string;
    fecha: Date;
  }) {
    const nueva = await this.publicacionModel.create({
      ...data,
      usuarioId: new Types.ObjectId(data.usuarioId) 
    });

    return {
      mensaje: 'Publicación creada exitosamente',
      publicacion: nueva,
    };
  }


  findAll() {
    return `This action returns all publicaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacione`;
  }
  
  async obtenerUltimasTres(usuarioId: string) {
    const objectId = new Types.ObjectId(usuarioId);

    return await this.publicacionModel
      .find({ usuarioId: objectId })
      .sort({ fecha: -1 })
      .limit(3)
      .exec();
  }

  async obtenerUltimasTresDesdeToken(token: string, ip: string) {
    const usuario = await this.authService.traerDatos(token, ip);
    if (!usuario) throw new Error('Token inválido');
    return this.obtenerUltimasTres(usuario.id);
  }

  update(id: number, updatePublicacioneDto: UpdatePublicacioneDto) {
    return `This action updates a #${id} publicacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicacione`;
  }
}
