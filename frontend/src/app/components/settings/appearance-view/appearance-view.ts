import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService, ThemeMode } from '../../../services/theme.service';

@Component({
  selector: 'app-appearance-view',
  templateUrl: './appearance-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceView {
  themeService = inject(ThemeService);

  setTheme(mode: ThemeMode) {
    this.themeService.setTheme(mode);
  }

  isActive(mode: ThemeMode): boolean {
    return this.themeService.themeMode() === mode;
  }
}
