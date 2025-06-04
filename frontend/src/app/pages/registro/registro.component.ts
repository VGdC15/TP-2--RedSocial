import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegistroComponent {
  registerForm: FormGroup;
  imagenSeleccionada: File | null = null;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      usuario: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      repetir: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      perfil: ['usuario']
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
  get correo() { return this.registerForm.get('correo'); }
  get usuario() { return this.registerForm.get('usuario'); }
  get password() { return this.registerForm.get('password'); }
  get repetir() { return this.registerForm.get('repetir'); }
  get fechaNacimiento() { return this.registerForm.get('fechaNacimiento'); }
  get descripcion() { return this.registerForm.get('descripcion'); }

  // Errores
  get showNombreRequired() { return this.nombre?.touched && this.nombre?.hasError('required'); }
  get showApellidoRequired() { return this.apellido?.touched && this.apellido?.hasError('required'); }
  get showCorreoRequired() { return this.correo?.touched && this.correo?.hasError('required'); }
  get showCorreoFormato() { return this.correo?.touched && this.correo?.hasError('email'); }
  get showUsuarioRequired() { return this.usuario?.touched && this.usuario?.hasError('required'); }
  get showPasswordRequired() { return this.password?.touched && this.password?.hasError('required'); }
  get showPasswordMin() { return this.password?.touched && this.password?.hasError('minlength'); }
  get showPasswordPattern() { return this.password?.touched && this.password?.hasError('pattern'); }
  get showRepetirRequired() { return this.repetir?.touched && this.repetir?.hasError('required'); }
  get showPasswordMatch() { return this.registerForm.hasError('noMatch') && this.repetir?.touched; }
  get showFechaRequired() { return this.fechaNacimiento?.touched && this.fechaNacimiento?.hasError('required'); }
  get showDescripcionRequired() { return this.descripcion?.touched && this.descripcion?.hasError('required'); }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const data = { ...this.registerForm.value, imagen: this.imagenSeleccionada };
    console.log('Datos enviados:', data);
  }
}
