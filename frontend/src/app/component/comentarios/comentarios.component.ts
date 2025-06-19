import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-comentarios',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
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

  trackById(index: number, item: any) {
    return item._id;
  }



}
