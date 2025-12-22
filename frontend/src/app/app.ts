import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { GlobalRail } from './components/layout/global-rail/global-rail';
import { CompanyService } from './services/company.service';
import { ProjectService } from './services/project.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterModule, GlobalRail],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Sensor Management System');
  
  projects = computed(() => {
    const companyId = this.companyService.selectedCompanyId();
    return this.projectService.getByCompanyId(companyId);
  });

  constructor(
    public authService: AuthService,
    public companyService: CompanyService,
    public projectService: ProjectService
  ) {}
}
