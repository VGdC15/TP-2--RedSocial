import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { Comentario } from './entities/comentario.entity';

@Injectable() 
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name)
    private readonly comentariosModel: Model<Comentario>,
  ) {}

  async create(dto: CreateComentarioDto, usuarioId: string): Promise<Comentario> {
    console.log('Creando comentario con DTO:', dto);
    const nueva = await this.comentariosModel.create({
      ...dto,
      usuarioId: new Types.ObjectId(usuarioId),
      publicacionId: new Types.ObjectId(dto.publicacionId),
      fecha: new Date(),
    });
    return nueva;
  } 

  async findByPublicacion(publicacionId: string, offset = 0, limit = 2): Promise<Comentario[]> {
    const comentarios = await this.comentariosModel
      .find({ publicacionId: new Types.ObjectId(publicacionId) })
      .sort({ fecha: 1 })
      .skip(offset)
      .limit(limit)
      .populate('usuarioId', 'nombre apellido usuario')
      .lean();

    return comentarios;
  }

  async update(id: string, dto: UpdateComentarioDto, usuarioId: string): Promise<Comentario> {
    const comentario = await this.comentariosModel.findById(id);
    if (!comentario) throw new Error('Comentario no encontrado');
    if (comentario.usuarioId.toString() !== usuarioId) {
      throw new Error('No tenés permisos para editar este comentario');
    }

    let modificado = false;

    if (dto.texto && dto.texto !== comentario.texto) {
      comentario.texto = dto.texto;
      modificado = true;
    }

    if (modificado) {
      comentario.modificado = true;
    }

    await comentario.save();
    return comentario;
  }


  async remove(id: string, usuarioId: string): Promise<{ mensaje: string }> {
    const comentario = await this.comentariosModel.findById(id);
    if (!comentario) throw new Error('Comentario no encontrado');
    if (comentario.usuarioId.toString() !== usuarioId) {
      throw new Error('No tenés permisos para eliminar este comentario');
    }
    await comentario.deleteOne();
    return { mensaje: 'Comentario eliminado' };
  }
}
