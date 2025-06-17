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

  // async listarPublicaciones(params: {
  //   ordenarPor: 'fecha' | 'meGusta';
  //   usuarioId?: string;
  //   offset: number;
  //   limit: number;
  // }): Promise<any[]> {
  //   const { ordenarPor, usuarioId, offset, limit } = params;

  //   const filtro: any = { activo: true };

  //   if (usuarioId) {
  //     filtro.usuarioId = usuarioId;
  //   }

  //   const orden: any = {};
  //   orden[ordenarPor] = -1; // descendente

  //   const publicaciones = await this.publicacionModel
  //     .find(filtro)
  //     .sort(orden)
  //     .skip(offset)
  //     .limit(limit)
  //     .exec();

  //   return publicaciones;
  // }
  async listarPublicaciones(params) {
    const { ordenarPor, usuarioId, offset, limit } = params;
    const filtro: any = { activo: true };
    const orden: any = {};
    orden[ordenarPor] = -1;

    const publicaciones = await this.publicacionModel
      .find(filtro)
      .sort(orden)
      .skip(offset)
      .limit(limit)
      .lean() // importante para que sea un objeto plano

    // Si recibís el usuario logueado, marcá si dio like
    if (usuarioId) {
      const userObjectId = new Types.ObjectId(usuarioId);
      publicaciones.forEach(pub => {
        (pub as any).yaDioLike = pub.usuariosQueDieronLike?.some((uid: Types.ObjectId) =>
          uid.equals(userObjectId)
        );
      });
    }

    return publicaciones;
  }

  findAll(): Promise<Publicacione[]> {
    return this.publicacionModel.find({ activo: true }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacione`;
  }
  
  async obtenerUltimasTres(usuarioId: string) {
    const objectId = new Types.ObjectId(usuarioId);

    return await this.publicacionModel
      .find({ usuarioId: objectId, activo: true })
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

  async bajaLogica(id: string, usuario: any) {
    const publicacion = await this.publicacionModel.findById(id);

    if (!publicacion) {
      throw new Error('Publicación no encontrada');
    }

    const esCreador = publicacion.usuarioId.toString() === usuario.id;
    const esAdmin = usuario.rol === 'admin'; 

    if (!esCreador && !esAdmin) {
      throw new Error('No tenés permisos para eliminar esta publicación');
    }

    publicacion.activo = false;
    await publicacion.save();

    return {
      mensaje: 'Publicación dada de baja lógicamente',
      id: publicacion._id,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} publicacione`;
  }

  async sumarLike(id: string, usuario: any) {
    const publicacion = await this.publicacionModel.findById(id);
    if (!publicacion) throw new Error('Publicación no encontrada');

    const userId = new Types.ObjectId(usuario.id);
    const yaDioLike = publicacion.usuariosQueDieronLike.some(uid => uid.equals(userId));

    if (yaDioLike) {
      publicacion.usuariosQueDieronLike = publicacion.usuariosQueDieronLike.filter(uid => !uid.equals(userId));
      publicacion.like = Math.max((publicacion.like || 1) - 1, 0);
    } else {
      publicacion.usuariosQueDieronLike.push(userId);
      publicacion.like = (publicacion.like || 0) + 1;
    }

    await publicacion.save();
    return { 
      like: publicacion.like,
      yaDioLike: publicacion.usuariosQueDieronLike.some(uid => uid.equals(userId))
    };
  }

}
