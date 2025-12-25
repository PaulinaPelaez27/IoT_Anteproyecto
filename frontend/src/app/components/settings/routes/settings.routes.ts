import { Routes } from '@angular/router';
import { ProfileView } from '../profile-view/profile-view';
import { NotificationsView } from '../notifications-view/notifications-view';

export const SETTINGS_ROUTES: Routes = [
  {
    path: 'profile',
    component: ProfileView,
  },
  {
    path: 'notifications',
    component: NotificationsView,
  },
];
