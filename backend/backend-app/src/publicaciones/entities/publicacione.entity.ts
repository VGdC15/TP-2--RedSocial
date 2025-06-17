import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Publicacione extends Document {
    @Prop({ required: true })
    imagen: string;

    @Prop({ required: true })
    pieDeFoto: string;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    usuarioId: Types.ObjectId;

    @Prop({ default: Date.now })
    fecha: Date;

    @Prop({ default: 0 })
    like: number;

    @Prop({ type: [Types.ObjectId], ref: 'Usuario', default: [] })
    usuariosQueDieronLike: Types.ObjectId[];

    @Prop({ default: true })
    activo: boolean;

}

export const PublicacioneSchema = SchemaFactory.createForClass(Publicacione);
