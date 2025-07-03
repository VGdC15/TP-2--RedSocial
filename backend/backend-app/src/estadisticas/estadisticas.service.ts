import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Aggregate } from 'mongoose';
import { Comentario } from 'src/comentarios/entities/comentario.entity';
import { Publicacione } from 'src/publicaciones/entities/publicacione.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel('Comentario') private comentarioModel: Model<Comentario>,
    @InjectModel('Publicacione') private publicacionModel: Model<Publicacione>
  ) {}

  async obtenerPublicacionesPorUsuario(
    fechaInicio: string,
    fechaFin: string
  ): Promise<Array<{ nombre: string; cantidad: number }>> {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const publicaciones = await this.publicacionModel.aggregate<
      { nombre: string; cantidad: number }
    >([
      { $match: { fecha: { $gte: inicio, $lte: fin } } },
      {
        $group: {
          _id: '$usuarioId',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      { $unwind: '$usuario' },
      {
        $project: {
          nombre: '$usuario.nombre',
          cantidad: 1,
        },
      },
    ]);

    return publicaciones;
  }

  async obtenerCantidadComentarios(
    fechaInicio: string,
    fechaFin: string
  ): Promise<Array<{ fecha: string; cantidad: number }>> {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const comentariosPorDia = await this.comentarioModel.aggregate<
      { fecha: string; cantidad: number }
    >([
      { $match: { fecha: { $gte: inicio, $lte: fin } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$fecha' }
          },
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          fecha: '$_id',
          cantidad: 1
        }
      },
      { $sort: { fecha: 1 } }
    ]);

    return comentariosPorDia;
  }


  async obtenerComentariosPorPublicacion(
    fechaInicio: string,
    fechaFin: string
  ): Promise<Array<{ pieDeFoto: string; cantidad: number }>> {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const comentarios = await this.comentarioModel.aggregate<
      { pieDeFoto: string; cantidad: number }
    >([
      { $match: { fecha: { $gte: inicio, $lte: fin } } },
      {
        $group: {
          _id: '$publicacionId',
          cantidad: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'publicaciones',
          localField: '_id',
          foreignField: '_id',
          as: 'publicacion',
        },
      },
      { $unwind: '$publicacion' },
      {
        $project: {
          pieDeFoto: '$publicacion.pieDeFoto',
          cantidad: 1,
        },
      },
    ]);

    return comentarios;
  }
}
