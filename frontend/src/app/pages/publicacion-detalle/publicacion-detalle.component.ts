import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../component/card/card.component';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './publicacion-detalle.component.html',
  styleUrl: './publicacion-detalle.component.css',
})
export class PublicacionDetalleComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  publicacion: any = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`http://localhost:3000/publicaciones/${id}`, { headers }).subscribe({
      next: (res) => this.publicacion = res,
      error: (err) => console.error('Error al cargar la publicación', err),
    });
  }
}

