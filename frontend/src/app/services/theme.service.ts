import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkMode = signal<boolean>(false);

  constructor() {
    // Load saved theme preference or detect system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.darkMode.set(isDark);

    // Apply theme changes to document
    effect(() => {
      const isDarkMode = this.darkMode();
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.darkMode.update((value) => !value);
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.set(isDark);
  }
}
