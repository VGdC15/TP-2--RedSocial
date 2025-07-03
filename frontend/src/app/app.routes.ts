import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { PantallaCargandoComponent } from './component/pantalla-cargando/pantalla-cargando.component';

export const routes: Routes = [
  { path: 'cargando', component: PantallaCargandoComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'publicaciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/publicaciones/publicaciones.component').then(m => m.PublicacionesComponent)
  },
  {
    path: 'publicacion/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/publicacion-detalle/publicacion-detalle.component').then(m => m.PublicacionDetalleComponent)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/mi-perfil/mi-perfil.component').then(m => m.MiPerfilComponent)
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/estadisticas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
