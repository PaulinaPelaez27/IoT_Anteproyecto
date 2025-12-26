import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export type NavSection = 'monitoring' | 'admin' | 'settings';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private activeSectionSignal = signal<NavSection>('monitoring');

  activeSection = this.activeSectionSignal.asReadonly();

  constructor(private router: Router) {}

  setActiveSection(section: NavSection): void {
    console.log('NavigationService: Setting active section to', section);
    this.activeSectionSignal.set(section);

    // Navigate to the appropriate route based on section
    switch (section) {
      case 'monitoring':
        this.router.navigate(['/monitoring']);
        break;
      case 'admin':
        this.router.navigate(['/admin/users']);
        break;
      case 'settings':
        this.router.navigate(['/settings/profile']);
        break;
    }
  }

  updateSectionFromRoute(url: string): void {
    if (url.startsWith('/admin')) {
      this.activeSectionSignal.set('admin');
    } else if (url.startsWith('/settings')) {
      this.activeSectionSignal.set('settings');
    } else if (url.startsWith('/project')) {
      this.activeSectionSignal.set('monitoring');
    }
  }
}
