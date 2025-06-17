import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  constructor(private http: HttpClient) {}

  @Input() imagen: string = '';
  @Input() pieDeFoto: string = '';
  @Input() fecha: string = '';
  @Input() usuario: string = '';
  @Input() id: string = '';
  @Input() like: number = 0;
  @Input() yaDioLike: boolean = false;


  darLike() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.patch<{ like: number, yaDioLike: boolean }>(
      `http://localhost:3000/publicaciones/${this.id}/like`,
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


}
