import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  httpClient = inject(HttpClient);

  constructor() { }

  //login
  login(datosLogin: { email: string; password: string }) {
    return this.httpClient.post('http://localhost:3000/login', datosLogin);
  }

  //registro
  // registro(datosRegistro: any, imagen: File) {
  //   const formData = new FormData();

  //   // Agrego todos los campos al FormData
  //   for (const key in datosRegistro) {
  //     formData.append(key, datosRegistro[key]);
  //   }

  //   // Agrego la imagen si existe
  //   if (imagen) {
  //     formData.append('imagenPerfil', imagen);
  //   }

  //   return this.httpClient.post('http://localhost:3000/registro', formData);
  // }

  // registro
  registro(datosRegistro: any, imagen: File) {
    const formData = new FormData();

    // Convertimos el nombre del campo de email a 'email' para que coincida con backend
    formData.append('nombre', datosRegistro.nombre);
    formData.append('apellido', datosRegistro.apellido);
    formData.append('email', datosRegistro.correo);  // aquí cambio a 'email'
    formData.append('usuario', datosRegistro.usuario);
    formData.append('password', datosRegistro.password);
    formData.append('fechaNacimiento', datosRegistro.fechaNacimiento);
    formData.append('descripcion', datosRegistro.descripcion);

    // Forzar estado = true para el registro
    formData.append('estado', 'true');

    // Agrego la imagen si existe
    if (imagen) {
      formData.append('imagenPerfil', imagen);
    }

    return this.httpClient.post('http://localhost:3000/registro', formData);
  }
}
