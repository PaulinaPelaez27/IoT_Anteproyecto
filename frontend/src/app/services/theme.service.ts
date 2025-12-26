import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkMode = signal<boolean>(false);
  themeMode = signal<ThemeMode>('system');
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // Load saved theme preference
    const savedTheme = (localStorage.getItem('theme') as ThemeMode) || 'system';
    this.themeMode.set(savedTheme);

    // Listen to system theme changes
    this.mediaQuery.addEventListener('change', (e) => {
      if (this.themeMode() === 'system') {
        this.darkMode.set(e.matches);
      }
    });

    // Apply initial theme
    this.applyTheme(savedTheme);

    // Apply theme changes to document
    effect(() => {
      const isDarkMode = this.darkMode();
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  setTheme(mode: ThemeMode) {
    this.themeMode.set(mode);
    localStorage.setItem('theme', mode);
    this.applyTheme(mode);
  }

  private applyTheme(mode: ThemeMode) {
    if (mode === 'system') {
      const prefersDark = this.mediaQuery.matches;
      this.darkMode.set(prefersDark);
    } else {
      this.darkMode.set(mode === 'dark');
    }
  }

  toggleTheme() {
    const currentMode = this.themeMode();
    if (currentMode === 'system') {
      const isCurrentlyDark = this.darkMode();
      const newMode: ThemeMode = isCurrentlyDark ? 'light' : 'dark';
      this.setTheme(newMode);
      return;
    }
    const newMode: ThemeMode = currentMode === 'dark' ? 'light' : 'dark';
    this.setTheme(newMode);
  }

  setDarkMode(isDark: boolean) {
    this.setTheme(isDark ? 'dark' : 'light');
  }
}
