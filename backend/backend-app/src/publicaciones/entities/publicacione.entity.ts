import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Publicacione extends Document {
    @Prop({ required: true })
    imagen: string;

    @Prop()
    pieDeFoto: string;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    usuarioId: Types.ObjectId;

    @Prop({ default: Date.now })
    fecha: Date;
}

export const PublicacioneSchema = SchemaFactory.createForClass(Publicacione);
