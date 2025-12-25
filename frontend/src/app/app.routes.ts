import { Routes } from '@angular/router';
import { AppLayout } from './components/layout/app-layout/app-layout';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: 'monitoring',
        loadChildren: () =>
          import('./components/monitoring/routes/monitoring-routes').then(
            (m) => m.MONITORING_ROUTES
          ),
      },
      {
        path: 'admin',
        canActivate: [roleGuard(['admin'])],
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
        pathMatch: 'full',
        redirectTo: 'monitoring',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
