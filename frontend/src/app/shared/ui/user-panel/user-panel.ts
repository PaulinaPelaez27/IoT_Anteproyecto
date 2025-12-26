import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPanelService } from './user-panel.service';
import { AuthService } from '../../../services/auth.service';
import { ClickOutsideDirective } from '../../utils/click-outside.directive';
import { LucideAngularModule, LogOut, X } from 'lucide-angular';

@Component({
  selector: 'ui-user-panel',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, LucideAngularModule],
  templateUrl: './user-panel.html',
})
export class UserPanel {
  panel = inject(UserPanelService);
  auth = inject(AuthService);

  user = this.auth.currentUser;

  readonly logoutIcon = LogOut;
  readonly closeIcon = X;

  logout() {
    this.auth.logout();
    this.panel.close();
  }
}
