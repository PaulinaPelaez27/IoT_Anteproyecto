import { Component } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { MonitoringSidebar } from '../sidebars/monitoring-sidebar/monitoring-sidebar';
import { AdminSidebar } from '../sidebars/admin-sidebar/admin-sidebar';
import { SettingsSidebar } from '../sidebars/settings-sidebar/settings-sidebar';

@Component({
  selector: 'app-context-sidebar',
  standalone: true,
  imports: [MonitoringSidebar, AdminSidebar, SettingsSidebar],
  templateUrl: './context-sidebar.html',
})
export class ContextSidebar {
  constructor(public navService: NavigationService) {}
}
