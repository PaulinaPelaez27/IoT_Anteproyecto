import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { CompanySwitcher } from '../../company-switcher/company-switcher';
import { ProjectList } from '../../../../shared/components/project-list/project-list';

@Component({
  selector: 'app-monitoring-sidebar',
  standalone: true,
  imports: [CompanySwitcher, ProjectList],
  templateUrl: './monitoring-sidebar.html',
})
export class MonitoringSidebar {
  constructor(public authService: AuthService) {}
}
