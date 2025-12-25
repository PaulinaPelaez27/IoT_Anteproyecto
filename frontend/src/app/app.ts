import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CompanyService } from './services/company.service';
import { ProjectService } from './services/project.service';
import { AuthService } from './services/auth.service';
import { NavigationService } from './services/navigation.service';
import { filter } from 'rxjs/operators';
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
