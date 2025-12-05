import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'empresas',
    loadChildren: () =>
      import('./features/empresas/empresas.routes')
        .then(r => r.EMPRESAS_ROUTES),
  },
  {
    path: 'proyectos',
    loadChildren: () =>
      import('./features/proyectos/proyectos.routes')
        .then(r => r.PROYECTOS_ROUTES),
  },
  {
  path: 'nodos',
  loadChildren: () =>
    import('./features/nodos/nodos.routes')
      .then(r => r.NODOS_ROUTES),
},

];
