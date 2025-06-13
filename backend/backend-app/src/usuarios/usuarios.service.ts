import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from './entities/usuario.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async create(usrDto: CreateUsuarioDto) {
    const instancia: UsuarioDocument = new this.usuarioModel({
      nombre: usrDto.nombre,
      apellido: usrDto.apellido,
      email: usrDto.email,
      usuario: usrDto.usuario,
      password: usrDto.password,
      fechaNacimiento: usrDto.fechaNacimiento,
      descripcion: usrDto.descripcion,
      estado: usrDto.estado,
      imagenPerfil: usrDto.imagenPerfil,
    });
    const guardado = await instancia.save();

    return guardado;
  }

  async findAll() {
    const todos: Usuario[] = await this.usuarioModel.find();
    return todos;
  }

  async findOne(id: string) {
    const uno = await this.usuarioModel.findById(id);
    return uno;
  }

  async update(id: string, updDto: UpdateUsuarioDto) {
    const editado = await this.usuarioModel.updateOne(
      { _id: id },
      { nombre: updDto.nombre, apellido: updDto.apellido, email: updDto.email,
        usuario: updDto.usuario, password: updDto.password, fechaNacimiento: updDto.fechaNacimiento,
        descripcion: updDto.descripcion, estado: updDto.estado, imagenPerfil: updDto.imagenPerfil
       },
    );
    return editado;
  }

  async remove(id: string) {
    const eliminado = await this.usuarioModel.deleteOne({ _id: id });
    return eliminado;
  }

  async findByEmailOrUsuario(email: string, usuario: string) {
    return await this.usuarioModel.findOne({
      $or: [{ email }, { usuario }]
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioModel.findOne({ email }).exec();
    return usuario;
  }

  async findByUsuario(usuario: string): Promise<Usuario | null> {
    const usuarioEncontrado = await this.usuarioModel.findOne({ usuario }).exec();
    return usuarioEncontrado;
  }

  async findById(id: string) {
    const usuario = await this.usuarioModel.findById(id);
    return usuario;
  }

}