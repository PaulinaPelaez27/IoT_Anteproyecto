import { Routes } from '@angular/router';
import {
  MONITORING_ROUTES,
  MONITORING_MODAL_ROUTES,
} from './components/monitoring/routes/monitoring.routes';
import { ADMIN_ROUTES, ADMIN_MODAL_ROUTES } from './components/admin/routes/admin.routes';
import {
  SETTINGS_ROUTES,
  SETTINGS_MODAL_ROUTES,
} from './components/settings/routes/settings.routes';

export const routes: Routes = [
  {
    path: 'monitoring',
    children: MONITORING_ROUTES,
  },
  {
    path: 'admin',
    children: ADMIN_ROUTES,
  },
  {
    path: 'settings',
    children: SETTINGS_ROUTES,
  },
  // Modal routes (at root level for named outlet)
  ...MONITORING_MODAL_ROUTES,
  ...ADMIN_MODAL_ROUTES,
  ...SETTINGS_MODAL_ROUTES,
  {
    path: '',
    redirectTo: 'monitoring',
    pathMatch: 'full',
  },
];
