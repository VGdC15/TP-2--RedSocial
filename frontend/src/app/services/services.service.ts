import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { of, MonoTypeOperatorFunction } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  httpClient = inject(HttpClient);
  private router = inject(Router);

  // Base  API (Render en prod, localhost en dev)
  private api = environment.apiUrl;

  constructor() { }

  // Helper para headers con token 
  private authHeaders() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token');
    return { Authorization: `Bearer ${token}` };
  }

  // login
  login(datosLogin: { email: string; password: string }) {
    return this.httpClient.post(`${this.api}/login`, datosLogin);
  }

  // obtener datos del usuario logueado
  obtenerDatosUsuario() {
    const headers = this.authHeaders();
    const peticion = this.httpClient.get(`${this.api}/datos`, { headers });
    return peticion.pipe(this.manejarError401());
  }

  // obtener mis publicaciones
  obtenerPublicaciones(params: any) {
    const headers = this.authHeaders();
    const url = `${this.api}/publicaciones`;
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
    formData.append('estado', 'true'); // forzar true en registro

    if (imagen) {
      formData.append('imagenPerfil', imagen);
    }

    return this.httpClient.post(`${this.api}/registro`, formData);
  }

  editarComentario(id: string, texto: string) {
    const headers = this.authHeaders();
    const body = { texto };
    const peticion = this.httpClient.patch(`${this.api}/comentarios/${id}`, body, { headers });
    return peticion.pipe(this.manejarError401());
  }

  refrescarToken(): Observable<{ token: string }> {
    const headers = this.authHeaders();
    const peticion = this.httpClient.get<{ token: string }>(
      `${this.api}/auth/refresh-token`,
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

  getEstadisticasPublicaciones(
    fechaInicio: string,
    fechaFin: string
  ): Observable<{ nombre: string; cantidad: number }[]> {
    const headers = this.authHeaders();
    const options = { headers, params: { fechaInicio, fechaFin } };
    const url = `${this.api}/estadisticas/publicaciones`;
    const peticion = this.httpClient.get<{ nombre: string; cantidad: number }[]>(url, options);
    return peticion.pipe(this.manejarError401<{ nombre: string; cantidad: number }[]>());
  }

  getEstadisticasComentarios(
    fechaInicio: string,
    fechaFin: string
  ): Observable<{ fecha: string; cantidad: number }[]> {
    const headers = this.authHeaders();
    const options = { headers, params: { fechaInicio, fechaFin } };
    const url = `${this.api}/estadisticas/comentarios`;
    const peticion = this.httpClient.get<{ fecha: string; cantidad: number }[]>(url, options);
    return peticion.pipe(this.manejarError401<{ fecha: string; cantidad: number }[]>());
  }

  getComentariosPorPublicacion(
    fechaInicio: string,
    fechaFin: string
  ): Observable<{ pieDeFoto: string; cantidad: number }[]> {
    const headers = this.authHeaders();
    const options = { headers, params: { fechaInicio, fechaFin } };
    const url = `${this.api}/estadisticas/comentarios-por-publicacion`;
    const peticion = this.httpClient.get<{ pieDeFoto: string; cantidad: number }[]>(url, options);
    return peticion.pipe(this.manejarError401<{ pieDeFoto: string; cantidad: number }[]>());
  }
}
