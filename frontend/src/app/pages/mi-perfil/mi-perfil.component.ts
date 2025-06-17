import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services.service'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../component/card/card.component'; 

@Component({
  selector: 'app-mi-perfil',
  imports: [ReactiveFormsModule, CardComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit {
  usuario: any = null;
  formularioPublicacion: FormGroup;
  imagenSeleccionada: File | null = null;
  publicaciones: any[] = [];

  constructor(private servicesService: ServicesService, private fb: FormBuilder, private http: HttpClient) {
    this.formularioPublicacion = this.fb.group({
    pieDeFoto: [''],
    imagen: [null]
  });
  }

  ngOnInit(): void {
    this.servicesService.obtenerDatosUsuario().subscribe({
      next: (data: any) => {
        this.usuario = data;

        this.traerMisPublicaciones();
      },
      error: (err) => {
        console.error('Error al obtener los datos del usuario', err);
      }
    });
  }


  onFileChange(event: any) {
    this.imagenSeleccionada = event.target.files[0];
  }

  subirPublicacion() {
    const formData = new FormData();
    formData.append('pieDeFoto', this.formularioPublicacion.get('pieDeFoto')?.value);

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<any>('http://localhost:3000/publicaciones', formData, { headers })
      .subscribe({
        next: (res) => {
          console.log('Publicación subida', res);

          const nueva = res.publicacion;
          this.publicaciones.unshift(nueva);

          if (this.publicaciones.length > 3) {
            this.publicaciones = this.publicaciones.slice(0, 3);
          }

          this.formularioPublicacion.reset();
          this.imagenSeleccionada = null;
        },
        error: (err) => {
          console.error('Error al subir publicación', err);
        }
      });
  }


  traerMisPublicaciones() {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:3000/publicaciones/mias', { headers })
      .subscribe({
        next: (res) => {
          console.log('🔍 Publicaciones recibidas:', res);
          this.publicaciones = res;
        },
        error: (err) => {
          console.error('Error al obtener publicaciones', err);
        }
      });
  }

}
