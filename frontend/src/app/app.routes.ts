import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'monitoring',
    loadChildren: () =>
      import('./components/monitoring/routes/monitoring.routes').then((m) => m.MONITORING_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/admin/routes/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./components/settings/routes/settings.routes').then((m) => m.SETTINGS_ROUTES),
  },
  {
    path: '',
    redirectTo: 'monitoring',
    pathMatch: 'full',
  },
];
