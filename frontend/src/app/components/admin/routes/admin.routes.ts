import { Routes } from '@angular/router';
import { CompaniesView } from '../companies-view/companies-view';
import { UsersView } from '../users-view/users-view';
import { RolesView } from '../roles-view/roles-view';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'companies',
    component: CompaniesView,
  },
  {
    path: 'users',
    component: UsersView,
  },
  {
    path: 'roles',
    component: RolesView,
  },
];
