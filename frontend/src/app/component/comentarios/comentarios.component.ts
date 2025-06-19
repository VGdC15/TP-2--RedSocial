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

  private http = inject(HttpClient);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['publicacionId'] && this.publicacionId) {
      this.cargar();
    }
  }

  get headers() {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  cargar() {
    this.http.get<any[]>(`http://localhost:3000/comentarios/publicacion/${this.publicacionId}`, {
      headers: this.headers,
    }).subscribe(res => {
      this.comentarios = res;
    });
  }

  agregar() {
    const dto = { publicacionId: this.publicacionId, texto: this.textoCtrl.value! };
    this.http.post(`http://localhost:3000/comentarios`, dto, { headers: this.headers })
      .subscribe(() => {
        this.textoCtrl.reset();
        this.cargar();
      });
  }

  trackById(index: number, item: any) {
    return item._id;
  }
}
