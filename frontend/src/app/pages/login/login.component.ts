import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { Router } from '@angular/router';
import { SwalService } from '../../services/swal.service';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private service: ServicesService,
    private router: Router,
    private swal: SwalService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get showEmailRequired() {
    return this.email?.touched && this.email?.errors?.['required'];
  }

  get showEmailFormat() {
    return this.email?.touched && this.email?.errors?.['email'];
  }

  get showPasswordRequired() {
    return this.password?.touched && this.password?.errors?.['required'];
  }

  get showPasswordMinLength() {
    return this.password?.touched && this.password?.errors?.['minlength'];
  }

  get showPasswordPattern() {
    return this.password?.touched && this.password?.errors?.['pattern'];
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const datosLogin = this.loginForm.value;

    this.service.login(datosLogin).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('idUsuario', res.usuario.id);
        this.swal.mostrar('Bienvenid@', 'Inicio de sesión exitoso', 'success', true, 2000, '/publicaciones');
      },
      error: (err) => {
        console.error('Error en login:', err);
        alert('Correo o contraseña incorrectos');
      }
    });
  }
}

