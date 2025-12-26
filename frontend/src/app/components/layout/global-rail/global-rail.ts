import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NavigationService, NavSection } from '../../../services/navigation.service';
import { LucideAngularModule, Settings, ShieldUser, SquareKanban } from 'lucide-angular';

import type { LucideIconData } from 'lucide-angular';

interface NavItem {
  id: NavSection;
  label: string;
  icon: LucideIconData;
  requiresAdmin?: boolean;
}

@Component({
  selector: 'app-global-rail',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './global-rail.html',
  styleUrl: './global-rail.css',
})
export class GlobalRail {
  readonly monitoringIcon = SquareKanban;
  readonly adminIcon = ShieldUser;
  readonly settingsIcon = Settings;

  navItems: NavItem[] = [
    {
      id: 'monitoring',
      label: 'Monitoreo',
      icon: this.monitoringIcon,
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: this.adminIcon,
      requiresAdmin: true,
    },
    {
      id: 'settings',
      label: 'Config',
      icon: this.settingsIcon,
    },
  ];

  constructor(public authService: AuthService, public navService: NavigationService) {}

  setActiveSection(section: NavSection): void {
    this.navService.setActiveSection(section);
  }

  canShowItem(item: NavItem): boolean {
    if (item.requiresAdmin) {
      return this.authService.isAdmin();
    }
    return true;
  }
}
