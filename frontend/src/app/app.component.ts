import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { ServicesService } from './services/services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private service = inject(ServicesService);
  private router = inject(Router);

  private contador: any;
  private modalActivo = false;

  rutasSinNavbar = ['/login', '/registro', '/cargando'];

  ngOnInit() {
    this.iniciarContadorSesion();
  }

  mostrarNavbar(): boolean {
    return !this.rutasSinNavbar.includes(this.router.url);
  }

  iniciarContadorSesion() {
    this.limpiarContador();

    this.contador = setTimeout(() => {
      this.mostrarModalRenovarSesion();
    }, 10 * 60 * 1000); // 10 minutos
  }

  limpiarContador() {
    if (this.contador) clearTimeout(this.contador);
  }

  mostrarModalRenovarSesion() {
    if (this.modalActivo) return;
    this.modalActivo = true;

    Swal.fire({
      title: '¿Aún estás ahí?',
      text: 'Quedan 5 minutos para que tu sesión expire.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, renovar',
      cancelButtonText: 'Cerrar sesión',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then(resultado => {
      this.modalActivo = false;

      if (resultado.isConfirmed) {
        this.service.refrescarToken().subscribe({
          next: (res: { token: string }) => {
            localStorage.setItem('token', res.token);
            this.iniciarContadorSesion(); // reiniciamos el contador
            Swal.fire('¡Sesión renovada!', '', 'success');
          },
          error: () => {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        });
      } else {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
