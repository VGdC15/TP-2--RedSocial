import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PublicacionesComponent } from './pages/publicaciones/publicaciones.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { authGuard } from './guards/auth.guard';
import { PublicacionDetalleComponent } from './pages/publicacion-detalle/publicacion-detalle.component';
import { PantallaCargandoComponent } from './component/pantalla-cargando/pantalla-cargando.component';

export const routes: Routes = [
    { path: 'cargando', component: PantallaCargandoComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'login', component: LoginComponent },
    { path: 'publicaciones', component: PublicacionesComponent, canActivate: [authGuard] },
    { path: 'publicacion/:id', component: PublicacionDetalleComponent, canActivate: [authGuard] },
    { path: 'perfil', component: MiPerfilComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
