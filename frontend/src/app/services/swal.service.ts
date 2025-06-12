import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SwalService {
  constructor(private router: Router) {}

  mostrar(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'warning' = 'success', autoCerrar = false, tiempo = 2000, redireccion?: string) {
    Swal.fire({
      icon: tipo,
      title: titulo,
      text: mensaje,
      timer: autoCerrar ? tiempo : undefined,
      showConfirmButton: !autoCerrar,
      showCloseButton: !autoCerrar,
      timerProgressBar: autoCerrar,
      buttonsStyling: true
    }).then(() => {
      if (redireccion) {
        this.router.navigate([redireccion]);
      }
    });
  }
}
