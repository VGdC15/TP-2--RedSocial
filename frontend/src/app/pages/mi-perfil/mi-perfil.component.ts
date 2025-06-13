import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service'; 

@Component({
  selector: 'app-mi-perfil',
  imports: [],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  usuario: any = null;

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    this.servicesService.obtenerDatosUsuario().subscribe({
      next: (data: any) => {
        this.usuario = data;
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario', err);
      }
    });
  }
}
