import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppLayout } from './components/layout/app-layout/app-layout';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, AppLayout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Sensor Management System');
}
