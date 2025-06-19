import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../component/card/card.component';
import { ComentariosComponent } from '../../component/comentarios/comentarios.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, ComentariosComponent, RouterLink],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent implements OnInit {
  private http = inject(HttpClient);

  publicaciones: any[] = [];
  usuarios: any[] = [];

  usuarioControl = new FormControl<string | null>(null);

  offset = 0;
  limit = 10;
  ordenarPor: 'fecha' | 'like' = 'fecha';

  ngOnInit(): void {
    this.cargarUsuarios();
    this.usuarioControl.valueChanges.subscribe(() => {
      this.offset = 0;
      this.cargarPublicaciones();
    });
    this.cargarPublicaciones();
  }

  cargarUsuarios(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:3000/usuarios', { headers }).subscribe({
      next: (res) => (this.usuarios = res),
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }

  cargarPublicaciones(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const usuarioId = this.usuarioControl.value;

    const params: any = {
      ordenarPor: this.ordenarPor,
      offset: this.offset,
      limit: this.limit,
    };
    if (usuarioId) {
      params.usuarioId = usuarioId;
    }

    this.http.get<any[]>('http://localhost:3000/publicaciones', { headers, params }).subscribe({
      next: (res) => (this.publicaciones = res),
      error: (err) => console.error('Error al cargar publicaciones', err),
    });
  }

  cambiarOrden(orden: 'fecha' | 'like') {
    this.ordenarPor = orden;
    this.offset = 0;
    this.cargarPublicaciones();
  }

  siguientePagina() {
    this.offset += this.limit;
    this.cargarPublicaciones();
  }

  anteriorPagina() {
    this.offset = Math.max(this.offset - this.limit, 0);
    this.cargarPublicaciones();
  }


  limpiarFiltro(): void {
    this.usuarioControl.setValue(null);
    this.offset = 0;
    this.cargarPublicaciones();
  }

}
