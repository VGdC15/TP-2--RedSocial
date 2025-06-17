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

  // obtener datos del usuario logueado
  obtenerDatosUsuario() {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró el token');
    }

    return this.httpClient.get('http://localhost:3000/datos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // obtener mis publicaciones
  obtenerMisPublicaciones() {
    const token = localStorage.getItem('token');

    if (!token) throw new Error('No se encontró el token');

    const headers = { Authorization: `Bearer ${token}` };
    return this.httpClient.get('http://localhost:3000/publicaciones/mias', { headers });
  }


  // registro
  registro(datosRegistro: any, imagen: File) {
    const formData = new FormData();

    formData.append('nombre', datosRegistro.nombre);
    formData.append('apellido', datosRegistro.apellido);
    formData.append('email', datosRegistro.email);  
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
