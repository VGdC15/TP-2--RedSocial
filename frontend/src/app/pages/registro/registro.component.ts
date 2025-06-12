import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { Router } from '@angular/router';
import { SwalService } from '../../services/swal.service';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegistroComponent {
  registerForm: FormGroup;
  imagenSeleccionada: File | null = null;

  constructor(private fb: FormBuilder, private service: ServicesService, 
    private router: Router, private swal: SwalService) {
    this.registerForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
      ]],
      apellido: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      usuario: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      repetir: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagenPerfil: ['usuario']
    }, { validators: this.matchPasswords });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.imagenSeleccionada = input.files[0];
    }
  }

  matchPasswords: ValidatorFn = (group: AbstractControl) => {
    const pass = group.get('password')?.value;
    const rep = group.get('repetir')?.value;
    return pass === rep ? null : { noMatch: true };
  };

  // Getters
  get nombre() { return this.registerForm.get('nombre'); }
  get apellido() { return this.registerForm.get('apellido'); }
  get email() { return this.registerForm.get('email'); }
  get usuario() { return this.registerForm.get('usuario'); }
  get password() { return this.registerForm.get('password'); }
  get repetir() { return this.registerForm.get('repetir'); }
  get fechaNacimiento() { return this.registerForm.get('fechaNacimiento'); }
  get descripcion() { return this.registerForm.get('descripcion'); }
  get imagenPerfil() { return this.registerForm.get('imagenPerfil'); }

  // Errores
  get showNombreRequired() { return this.nombre?.touched && this.nombre?.hasError('required'); }
  get showApellidoRequired() { return this.apellido?.touched && this.apellido?.hasError('required'); }
  get showEmailRequired() { return this.email?.touched && this.email?.hasError('required'); }
  get showEmailFormato() { return this.email?.touched && this.email?.hasError('email'); }
  get showUsuarioRequired() { return this.usuario?.touched && this.usuario?.hasError('required'); }
  get showPasswordRequired() { return this.password?.touched && this.password?.hasError('required'); }
  get showPasswordMin() { return this.password?.touched && this.password?.hasError('minlength'); }
  get showPasswordPattern() { return this.password?.touched && this.password?.hasError('pattern'); }
  get showRepetirRequired() { return this.repetir?.touched && this.repetir?.hasError('required'); }
  get showPasswordMatch() { return this.registerForm.hasError('noMatch') && this.repetir?.touched; }
  get showFechaRequired() { return this.fechaNacimiento?.touched && this.fechaNacimiento?.hasError('required'); }
  get showDescripcionRequired() { return this.descripcion?.touched && this.descripcion?.hasError('required'); }
  get showImagenNoSeleccionada() {return this.registerForm.touched && !this.imagenSeleccionada;}


  soloLetras(event: KeyboardEvent): void {
    const key = event.key;
    const letrasPermitidas = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;

    if (!letrasPermitidas.test(key) && key !== 'Backspace' && key !== 'Tab' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
      event.preventDefault();
    }
  }

  onSubmit(): void {
  if (this.registerForm.invalid || !this.imagenSeleccionada) {
    console.error('Formulario inválido o imagen no seleccionada');
    return;
  }

  const datos = this.registerForm.value;
  const imagen = this.imagenSeleccionada as File;

  this.service.registro(datos, imagen).subscribe({
    next: (respuesta) => {
      console.log('Usuario registrado:', respuesta);

      this.swal.mostrar(
        'Registro exitoso',
        'Tu cuenta ha sido creada correctamente',
        'success',
        true,
        2000,
        '/login'
      );
    },
    error: (error) => {
      console.error('Error al registrar:', error);
      const mensaje = error?.error?.mensaje || 'Ocurrió un error inesperado';

      this.swal.mostrar(
        'Usuario ya registrado',
        mensaje,
        'error',
        true,
        3000
      );
    }

  });
}




}
