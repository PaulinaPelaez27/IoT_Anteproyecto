import { Routes } from '@angular/router';
import { ProfileView } from '../profile-view/profile-view';
import { SecurityView } from '../security-view/security-view';
import { NotificationsView } from '../notifications-view/notifications-view';
import { AppearanceView } from '../appearance-view/appearance-view';

// Regular settings routes (nested under /settings)
export const SETTINGS_ROUTES: Routes = [
  {
    path: 'profile',
    component: ProfileView,
  },
  {
    path: 'security',
    component: SecurityView,
  },
  {
    path: 'notifications',
    component: NotificationsView,
  },
  {
    path: 'appearance',
    component: AppearanceView,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
];

// Modal routes for settings (at root level with named outlet)
export const SETTINGS_MODAL_ROUTES: Routes = [
  // Future:
  // { path: 'profile/edit', outlet: 'modal', component: ProfileFormModal },
  // { path: 'password/change', outlet: 'modal', component: PasswordChangeModal },
];
