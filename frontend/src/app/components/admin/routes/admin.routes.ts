import { Routes } from '@angular/router';
import { CompaniesView } from '../companies-view/companies-view';
import { UsersView } from '../users-view/users-view';
import { RolesView } from '../roles-view/roles-view';

// Regular admin routes (nested under /admin)
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

// Modal routes for admin (at root level with named outlet)
export const ADMIN_MODAL_ROUTES: Routes = [
  // Future:
  // { path: 'user/edit/:id', outlet: 'modal', component: UserFormModal },
  // { path: 'company/edit/:id', outlet: 'modal', component: CompanyFormModal },
  // { path: 'role/edit/:id', outlet: 'modal', component: RoleFormModal },
];
