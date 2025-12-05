// src/app/features/empresas/empresas.routes.ts

import { Routes } from '@angular/router';

export const EMPRESAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/empresas-list/empresas-list.component').then(
        (m) => m.EmpresasListComponent,
      ),
  },
  // Más rutas después: crear, editar, etc.
];
