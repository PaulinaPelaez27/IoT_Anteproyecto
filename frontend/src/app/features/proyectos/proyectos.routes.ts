import { Routes } from '@angular/router';

export const PROYECTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/proyectos-list/proyectos-list.component')
        .then(c => c.ProyectosListComponent),
  },
  /*
  {
    path: 'crear',
    loadComponent: () =>
      import('./pages/proyecto-create/proyecto-create.component')
        .then(c => c.ProyectoCreateComponent),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./pages/proyecto-edit/proyecto-edit.component')
        .then(c => c.ProyectoEditComponent),
  },
  */
];
