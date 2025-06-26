import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema()
export class Usuario {
    _id?: ObjectId;

    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    apellido: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    usuario: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, type: Date })
    fechaNacimiento: Date;

    @Prop({ required: true })
    descripcion: string;

    @Prop({ required: true })
    imagenPerfil: string;

    @Prop({ required: true })
    estado: boolean;

    @Prop({ default: 'usuario' })
    rol: 'usuario' | 'admin';

}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
