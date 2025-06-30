import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../../services/services.service';
import Swal from 'sweetalert2';

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

  darDeBajaUsuario(usuarioId: string) {
    Swal.fire({
      title: '¿Estás segur@?',
      text: 'Esta acción dará de baja al usuario seleccionado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const body = { estado: false };

        this.http.patch(`http://localhost:3000/usuarios/${usuarioId}`, body, { headers })
          .subscribe({
            next: () => {
              const usuario = this.usuarioFiltrado.find(u => u._id === usuarioId);
              if (usuario) usuario.estado = false;

              const index = this.usuarios.findIndex(u => u._id === usuarioId);
              if (index !== -1) this.usuarios[index].estado = false;

              Swal.fire({
                title: '¡Hecho!',
                text: 'El usuario fue dado de baja.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (err) => {
              console.error('Error al dar de baja el usuario', err);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo dar de baja al usuario.',
                icon: 'error'
              });
            }
          });
      }
    });
  }

  darDeAltaUsuario(usuarioId: string) {
    Swal.fire({
      title: '¿Dar de alta al usuario?',
      text: 'Esta acción reactivará al usuario.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de alta',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const body = { estado: true };

        this.http.patch(`http://localhost:3000/usuarios/${usuarioId}`, body, { headers })
          .subscribe({
            next: () => {
              const usuario = this.usuarioFiltrado.find(u => u._id === usuarioId);
              if (usuario) usuario.estado = true;

              const index = this.usuarios.findIndex(u => u._id === usuarioId);
              if (index !== -1) this.usuarios[index].estado = true;

              Swal.fire({
                title: '¡Hecho!',
                text: 'El usuario fue dado de alta.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            },
            error: (err) => {
              console.error('Error al dar de alta el usuario', err);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo dar de alta al usuario.',
                icon: 'error'
              });
            }
          });
      }
    });
  }



}
