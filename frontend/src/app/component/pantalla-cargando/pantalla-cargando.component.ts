import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pantalla-cargando',
  standalone: true,
  templateUrl: './pantalla-cargando.component.html',
  styleUrls: ['./pantalla-cargando.component.css']
})
export class PantallaCargandoComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  ngOnInit() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post(`${this.api}/auth/autorizar`, {}, { headers }).subscribe({
      next: () => {
        setTimeout(() => {
          import('sweetalert2').then(Swal => {
            Swal.default.fire({
              title: 'Bienvenid@',
              text: 'Inicio de sesión exitoso',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/publicaciones']);
            });
          });
        }, 1000); 
      },
      error: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}
