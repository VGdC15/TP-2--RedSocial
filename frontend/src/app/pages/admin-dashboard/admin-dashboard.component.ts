import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  services = inject(ServicesService);

  usuarios: any[] = [];
  usuarioFiltrado: any[] = [];
  usuarioControl = new FormControl<string | null>(null);

  ngOnInit(): void {
    this.cargarUsuarios(); 

    this.usuarioControl.valueChanges.subscribe((idSeleccionado) => {
      if (!idSeleccionado) {
        this.usuarioFiltrado = []; 
      } else {
        const usuario = this.usuarios.find(u => u._id === idSeleccionado);
        this.usuarioFiltrado = usuario ? [usuario] : [];
      }
    });
  }

  cargarUsuarios(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:3000/usuarios', { headers }).subscribe({
      next: (res) => {
        this.usuarios = res;
      },
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }
}
