import { Routes } from '@angular/router';
import { ProjectView } from './components/monitoring/project-view/project-view';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'project/project-1',
    pathMatch: 'full'
  },
  {
    path: 'project/:projectId',
    component: ProjectView
  },
  {
    path: 'project/:projectId/node/:nodeId',
    component: ProjectView
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['admin'])],
    children: [
      {
        path: 'users',
        loadComponent: () => import('./components/admin/users-view/users-view').then(m => m.UsersView)
      },
      {
        path: 'companies',
        loadComponent: () => import('./components/admin/companies-view/companies-view').then(m => m.CompaniesView)
      },
      {
        path: 'roles',
        loadComponent: () => import('./components/admin/roles-view/roles-view').then(m => m.RolesView)
      }
    ]
  },
  {
    path: 'settings',
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./components/settings/profile-view/profile-view').then(m => m.ProfileView)
      },
      {
        path: 'security',
        loadComponent: () => import('./components/settings/security-view/security-view').then(m => m.SecurityView)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./components/settings/notifications-view/notifications-view').then(m => m.NotificationsView)
      }
    ]
  }
];

