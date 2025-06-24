import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServicesService } from '../../services/services.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comentarios',
  standalone: true, 
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './comentarios.component.html', 
  styleUrls: ['./comentarios.component.css'],
})
export class ComentariosComponent implements OnChanges {
  @Input() publicacionId!: string;
  comentarios: any[] = [];
  textoCtrl = new FormControl('');
  offset = 0;
  limit = 2;
  hayMas = true;
  todosCargados = false;
  verTodo = false;

  private http = inject(HttpClient);
  service = inject(ServicesService);

  modoEdicion: { [idComentario: string]: boolean } = {};
  textoEditado: { [idComentario: string]: string } = {};
  usuarioLogueadoId: string | null = null;

  constructor() {
    this.usuarioLogueadoId = this.obtenerIdDesdeToken();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['publicacionId'] && this.publicacionId) {
      this.offset = 0;
      this.comentarios = [];
      this.hayMas = true;
      this.cargar();
    }
  }

  get headers() {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  get comentariosMostrados() {
    return this.verTodo ? this.comentarios : this.comentarios.slice(0, 2);
  }

  get mostrarToggle(): boolean {
    return this.comentarios.length >= 2 && (this.hayMas || this.comentarios.length > 2);
  }


  cargar() {
    this.http.get<{ comentarios: any[] }>(
      `http://localhost:3000/comentarios/publicacion/${this.publicacionId}?offset=${this.offset}&limit=${this.limit}`,
      { headers: this.headers }
    ).subscribe(res => {
      this.comentarios.push(...res.comentarios);
      this.offset += this.limit;
      this.hayMas = res.comentarios.length === this.limit;
      if (!this.hayMas) this.todosCargados = true;
    });
  }

  verMas() {
    if (!this.todosCargados) {
      this.http.get<{ comentarios: any[] }>(
        `http://localhost:3000/comentarios/publicacion/${this.publicacionId}?offset=${this.offset}&limit=${this.limit}`,
        { headers: this.headers }
      ).subscribe(res => {
        this.comentarios.push(...res.comentarios);
        this.offset += this.limit;
        this.hayMas = res.comentarios.length === this.limit;
        if (!this.hayMas) this.todosCargados = true;

        this.verTodo = true;
      });
    } else {
      this.verTodo = !this.verTodo;
    }
  }

  agregar() {
    const dto = { publicacionId: this.publicacionId, texto: this.textoCtrl.value! };
    this.http.post(`http://localhost:3000/comentarios`, dto, { headers: this.headers })
      .subscribe(() => {
        this.textoCtrl.reset();
        this.offset = 0;
        this.comentarios = [];
        this.hayMas = true;
        this.cargar();
      });
  }

  activarEdicion(comentario: any) {
    this.modoEdicion[comentario._id] = true;
    this.textoEditado[comentario._id] = comentario.texto;
  }

  cancelarEdicion(id: string) {
    this.modoEdicion[id] = false;
    this.textoEditado[id] = '';
  }

  guardarEdicion(comentario: any) {
    const textoNuevo = this.textoEditado[comentario._id];

    if (textoNuevo.trim() === '') return;

    this.service.editarComentario(comentario._id, textoNuevo).subscribe({
      next: (res: any) => {
        comentario.texto = res.comentario.texto;
        comentario.modificado = res.comentario.modificado;
        this.modoEdicion[comentario._id] = false;
      },
      error: (err) => {
        console.error('Error al editar comentario', err);
      }
    });
  }

  trackById(index: number, item: any) {
    return item._id;
  }

  eliminarComentario(id: string) {
    Swal.fire({
      title: '¿Eliminar comentario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#888',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:3000/comentarios/${id}`, { headers: this.headers })
          .subscribe({
            next: () => {
              this.comentarios = this.comentarios.filter(c => c._id !== id);
              Swal.fire('Eliminado', 'El comentario fue eliminado.', 'success');
            },
            error: (err) => {
              console.error('Error al eliminar comentario', err);
              Swal.fire('Error', 'No se pudo eliminar el comentario.', 'error');
            }
          });
      }
    });
  }

  private obtenerIdDesdeToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload._id || payload.id || null; 
    } catch {
      return null;
    }
  }


}
