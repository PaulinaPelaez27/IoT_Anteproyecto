import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { CompanySwitcher } from '../../company-switcher/company-switcher';
import { ProyectoService } from '../../../../services/proyecto.service';
import { EmpresaService } from '../../../../services/empresa.service';
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
  private empresaService = inject(EmpresaService);
  private modalService = inject(ModalService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  projects = signal<Proyecto[]>([]);
  loading = signal(false);
  isAdmin = inject(AuthService).isAdmin();

  selectedProyectoId = this.proyectoService.selectedProyectoId;

  private lastEmpresaId: string | null = null;

  constructor() {
    effect(() => {
      const empresaId = this.empresaService.selectedEmpresaId();
      if (!empresaId || empresaId === this.lastEmpresaId) return;

      this.lastEmpresaId = empresaId;
      this.loadProjects(empresaId);
    });
  }

  private loadProjects(empresaId: string) {
    this.loading.set(true);

    const projects = this.proyectoService.getByEmpresaId(empresaId);
    this.projects.set(projects);

    const current = this.proyectoService.selectedProyectoId();
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
