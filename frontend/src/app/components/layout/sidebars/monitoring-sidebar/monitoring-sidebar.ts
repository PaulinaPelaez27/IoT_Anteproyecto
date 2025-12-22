import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { CompanySwitcher } from '../../company-switcher/company-switcher';
import { ProjectList } from '../../../../shared/components/project-list/project-list';
import { ProjectService } from '../../../../services/project.service';
import { CompanyService } from '../../../../services/company.service';
import { Project } from '../../../../models/project.model';

@Component({
  selector: 'app-monitoring-sidebar',
  standalone: true,
  imports: [CompanySwitcher, ProjectList],
  templateUrl: './monitoring-sidebar.html',
})
export class MonitoringSidebar {
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private companyService = inject(CompanyService);

  isAdmin = this.authService.isAdmin();

  loading = signal(false);
  projects = signal<Project[]>([]);

  constructor() {
    effect(() => {
      const companyId = this.companyService.selectedCompanyId();

      if (!companyId) return;

      this.loadProjects(companyId);
    });
  }

  private async loadProjects(companyId: string) {
    this.loading.set(true);

    try {
      const projects = await this.projectService.getByCompanyId(companyId);
      this.projects.set(projects);
    } finally {
      this.loading.set(false);
    }
  }
}
