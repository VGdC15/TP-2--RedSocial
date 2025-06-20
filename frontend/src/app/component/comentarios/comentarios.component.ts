import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServicesService } from '../../services/services.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comentarios',
  standalone: true, 
  imports: [FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './comentarios.component.html', 
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
    return this.comentarios.length > 2 || this.hayMas;
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
      this.cargar();
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



}
