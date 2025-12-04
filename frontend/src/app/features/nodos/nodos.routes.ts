import { Routes } from '@angular/router';

export const NODOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/nodos-list/nodos-list.component')
        .then(c => c.NodosListComponent),
  },
];