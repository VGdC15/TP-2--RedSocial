import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { of, MonoTypeOperatorFunction } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() { }

  //login
  login(datosLogin: { email: string; password: string }) {
    return this.httpClient.post('http://localhost:3000/login', datosLogin);
  }

  // obtener datos del usuario logueado
  obtenerDatosUsuario() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token');

    const headers = { Authorization: `Bearer ${token}` };
    const peticion = this.httpClient.get('http://localhost:3000/datos', { headers });

    return peticion.pipe(this.manejarError401());
  }

  // obtener mis publicaciones
  obtenerPublicaciones(params: any) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token');

    const url = 'http://localhost:3000/publicaciones';
    const headers = { Authorization: `Bearer ${token}` };
    const opciones = { headers, params };
    const peticion = this.httpClient.get<any[]>(url, opciones).pipe(this.manejarError401());

    return peticion;
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

  refrescarToken(): Observable<{ token: string }> {
    const tokenGuardado = localStorage.getItem('token');
    if (!tokenGuardado) throw new Error('No se encontró el token');

    const headers = { Authorization: `Bearer ${tokenGuardado}` };
    const peticion = this.httpClient.get<{ token: string }>(
      'http://localhost:3000/auth/refresh-token',
      { headers }
    );

    return peticion.pipe(this.manejarError401<{ token: string }>());
  }


  manejarError401<T>(): MonoTypeOperatorFunction<T> {
    return (source) =>
      source.pipe(
        tap({
          error: (err) => {
            if (err.status === 401) {
              Swal.fire({
                title: 'Sesión expirada',
                text: 'Tu sesión ha expirado o el token no es válido.',
                icon: 'warning',
                confirmButtonText: 'OK',
                allowOutsideClick: false
              }).then(() => {
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
              });
            }
          }
        }),
        catchError((err) => throwError(() => err))
      );
  }

}
