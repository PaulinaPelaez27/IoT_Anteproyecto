import { Routes } from '@angular/router';
import { ProyectoView } from '../proyecto-view/proyecto-view';
import { ProjectFormModal } from '../project-form-modal/project-form-modal';

export const MONITORING_ROUTES: Routes = [
  {
    path: '',
    component: ProyectoView,
  },
];

// Modal routes for monitoring (at root level with named outlet)
export const MONITORING_MODAL_ROUTES: Routes = [
  {
    path: 'project/edit/:id',
    outlet: 'modal',
    component: ProjectFormModal,
  },
  {
    path: 'project/create',
    outlet: 'modal',
    component: ProjectFormModal,
  },
  // Future modal routes:
  // { path: 'node/edit/:id', outlet: 'modal', component: NodeFormModal },
  // { path: 'sensor/edit/:id', outlet: 'modal', component: SensorFormModal },
];
