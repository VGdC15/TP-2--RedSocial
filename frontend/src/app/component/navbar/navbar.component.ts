import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../services/services.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuario: any = null;
  menuOpen = false;

  constructor(private router: Router, private servicesService: ServicesService) {}

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


  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']);
  }
}
