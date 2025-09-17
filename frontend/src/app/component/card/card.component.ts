import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input} from '@angular/core';
import { ComentariosComponent } from '../comentarios/comentarios.component';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-card',
  imports: [CommonModule, ComentariosComponent],
  templateUrl: './card.component.html', 
  styleUrl: './card.component.css'
})
export class CardComponent {
  constructor(private http: HttpClient) {}

  private api = environment.apiUrl;

  @Input() imagen: string = '';
  @Input() pieDeFoto: string = '';
  @Input() fecha: string = '';
  @Input() usuario: string = '';
  @Input() id: string = '';
  @Input() like: number = 0;
  @Input() yaDioLike: boolean = false;
  @Input() esAdmin: boolean = false;
  @Input() activo!: boolean;
  @Input() publicacion: any;
  @Input() inactiva: boolean = false;


  darLike() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.patch<{ like: number, yaDioLike: boolean }>(
      `${this.api}/publicaciones/${this.id}/like`,
      {},
      { headers }
    ).subscribe({
      next: (res) => {
        this.like = res.like;
        this.yaDioLike = res.yaDioLike;
      },
      error: (err) => console.error('Error al dar me gusta', err)
    });
  }

  eliminarPublicacion() {
    Swal.fire({
      title: '¿Estás segur@?',
      text: 'Esta acción marcará la publicación como eliminada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      // Solo si el usuario confirmó
      if (result.isConfirmed) {
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.patch(
          `${this.api}/publicaciones/${this.id}/baja`,
          {},
          { headers }
        ).subscribe({
          next: () => {
            this.activo = false;
            Swal.fire({
              title: '¡Hecho!',
              text: 'La publicación fue eliminada.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error al eliminar la publicación', err);
            Swal.fire('Error', 'No se pudo eliminar la publicación.', 'error');
          }
        });
      }
    });
  }

  reactivarPublicacion() {
    Swal.fire({
      title: '¿Reactivar publicación?',
      text: 'Esta acción volverá a activar la publicación para que sea visible nuevamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.patch(
          `${this.api}/publicaciones/${this.id}/alta`,
          {},
          { headers }
        ).subscribe({
          next: () => {
            this.activo = true;

            Swal.fire({
              title: '¡Publicación reactivada!',
              text: 'La publicación ahora está activa nuevamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error al reactivar publicación', err);
            Swal.fire('Error', 'No se pudo reactivar la publicación.', 'error');
          }
        });
      }
    });
  }



}
