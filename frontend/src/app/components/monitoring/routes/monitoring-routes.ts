import { Routes } from '@angular/router';
import { ProjectView } from '../project-view/project-view';

export const MONITORING_ROUTES: Routes = [
  {
    path: 'project/:projectId',
    component: ProjectView,
    children: [
      {
        path: 'edit',
        outlet: 'modal',
        loadComponent: () =>
          import('../project-form-modal/project-form-modal').then((m) => m.ProjectFormModal),
      },
      {
        path: 'node/:nodeId',
        component: ProjectView,
      },
    ],
  },
];
