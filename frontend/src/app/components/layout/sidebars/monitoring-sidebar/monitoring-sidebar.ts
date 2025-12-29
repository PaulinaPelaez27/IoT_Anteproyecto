import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { CompanySwitcher } from '../../company-switcher/company-switcher';
import { ProyectoService } from '../../../../services/proyecto.service';
import { CompanyService } from '../../../../services/empresa.service';
import { Proyecto } from '../../../../models/proyecto.model';
import { Button } from '../../../../shared/ui';
import { ModalService } from '../../../../shared/ui/modal/modal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-monitoring-sidebar',
  standalone: true,
  imports: [CompanySwitcher, Button],
  templateUrl: './monitoring-sidebar.html',
})
export class MonitoringSidebar {
  private proyectoService = inject(ProyectoService);
  private companyService = inject(CompanyService);
  private modalService = inject(ModalService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  projects = signal<Proyecto[]>([]);
  loading = signal(false);
  isAdmin = inject(AuthService).isAdmin();

  selectedProjectId = this.proyectoService.selectedProjectId;

  private lastCompanyId: string | null = null;

  constructor() {
    effect(() => {
      const companyId = this.companyService.selectedCompanyId();

      if (!companyId || companyId === this.lastCompanyId) return;

      this.lastCompanyId = companyId;
      this.loadProjects(companyId);
    });
  }

  private loadProjects(companyId: string) {
    this.loading.set(true);

    const projects = this.proyectoService.getByEmpresaId(companyId);
    this.projects.set(projects);

    const current = this.proyectoService.selectedProjectId();
    const stillExists = projects.find((p) => p.id === current);

    this.proyectoService.selectProyecto(stillExists ? stillExists.id : projects[0]?.id ?? null);

    this.loading.set(false);
  }

  selectProject(projectId: string) {
    this.proyectoService.selectProyecto(projectId);
  }

  createProject() {
    this.modalService.show('Crear Proyecto', 'medium');
    this.router.navigate([{ outlets: { modal: ['project', 'create'] } }]);
  }
}
