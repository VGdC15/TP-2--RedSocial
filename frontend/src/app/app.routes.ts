import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PublicacionesComponent } from './pages/publicaciones/publicaciones.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: 'publicaciones', component: PublicacionesComponent, canActivate: [authGuard] },
    { path: 'perfil', component: MiPerfilComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
