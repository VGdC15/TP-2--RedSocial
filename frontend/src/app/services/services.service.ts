import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = environment.apiUrl; 

  // adjuntar error si existe el token
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders(); 
  }

  // ---------- Auth ----------
  login(datos: { email: string; password: string }) {
    return this.http.post(`${this.api}/login`, datos);
  }

  // ---------- Usuario ----------
  obtenerDatosUsuario() {
    const headers = this.authHeaders();
    const req = this.http.get(`${this.api}/datos`, { headers });
    return req.pipe(this.manejarError401());
  }

  // ---------- Publicaciones ----------
  obtenerPublicaciones(params: any) {
    const headers = this.authHeaders();
    const url = `${this.api}/publicaciones`;
    const req = this.http.get<any[]>(url, { headers, params });
    return req.pipe(this.manejarError401());
  }

  // ---------- Registro ----------
  registro(datos: any, imagen: File) {
    const fd = new FormData();
    fd.append('nombre', datos.nombre);
    fd.append('apellido', datos.apellido);
    fd.append('email', datos.email);
    fd.append('usuario', datos.usuario);
    fd.append('password', datos.password);
    fd.append('fechaNacimiento', datos.fechaNacimiento);
    fd.append('descripcion', datos.descripcion ?? '');
    fd.append('estado', 'true');
    fd.append('rol', 'usuario'); 

    if (imagen) fd.append('imagenPerfil', imagen);

    return this.http.post(`${this.api}/registro`, fd);
  }

  // ---------- Comentarios ----------
  editarComentario(id: string, texto: string) {
    const headers = this.authHeaders();
    const body = { texto };
    const req = this.http.patch(`${this.api}/comentarios/${id}`, body, { headers });
    return req.pipe(this.manejarError401());
  }

  // ---------- Tokens ----------
  refrescarToken(): Observable<{ token: string }> {
    const headers = this.authHeaders();
    const req = this.http.get<{ token: string }>(`${this.api}/auth/refresh-token`, { headers });
    return req.pipe(this.manejarError401<{ token: string }>());
  }

  // ---------- Estadísticas ----------
  getEstadisticasPublicaciones(fechaInicio: string, fechaFin: string) {
    const headers = this.authHeaders();
    const params = { fechaInicio, fechaFin };
    const req = this.http.get<{ nombre: string; cantidad: number }[]>(
      `${this.api}/estadisticas/publicaciones`,
      { headers, params }
    );
    return req.pipe(this.manejarError401());
  }

  getEstadisticasComentarios(fechaInicio: string, fechaFin: string) {
    const headers = this.authHeaders();
    const params = { fechaInicio, fechaFin };
    const req = this.http.get<{ fecha: string; cantidad: number }[]>(
      `${this.api}/estadisticas/comentarios`,
      { headers, params }
    );
    return req.pipe(this.manejarError401());
  }

  getComentariosPorPublicacion(fechaInicio: string, fechaFin: string) {
    const headers = this.authHeaders();
    const params = { fechaInicio, fechaFin };
    const req = this.http.get<{ pieDeFoto: string; cantidad: number }[]>(
      `${this.api}/estadisticas/comentarios-por-publicacion`,
      { headers, params }
    );
    return req.pipe(this.manejarError401());
  }

  // ---------- Manejo 401 mejorado ----------
  private manejarError401<T>() {
    return (source: Observable<T>) =>
      source.pipe(
        tap({
          error: (err: any) => {
            if (err?.status === 401) {
              const hadToken = !!localStorage.getItem('token');
              localStorage.removeItem('token');

              // Si había token, mostramos alerta; si no, redirigimos sin molestar
              if (hadToken) {
                Swal.fire({
                  title: 'Sesión expirada',
                  text: 'Tu sesión ha expirado o el token no es válido.',
                  icon: 'warning',
                  confirmButtonText: 'OK',
                  allowOutsideClick: false
                }).then(() => this.router.navigate(['/login']));
              } else {
                this.router.navigate(['/login']);
              }
            }
          }
        }),
        catchError((err) => throwError(() => err))
      );
  }
}