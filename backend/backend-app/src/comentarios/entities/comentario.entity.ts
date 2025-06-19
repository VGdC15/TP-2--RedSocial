import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Comentario extends Document {
  @Prop({ required: true })
  texto: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Publicacione' })
  publicacionId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Usuario' })
  usuarioId: Types.ObjectId;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
