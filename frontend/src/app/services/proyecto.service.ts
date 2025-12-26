import { Injectable, signal } from '@angular/core';
import { Proyecto } from '../models/project.model';
import { CreateProyectoDto } from '../components/monitoring/dtos/create-project.dto';

const MOCK_PROJECTS: Proyecto[] = [
  {
    id: 'project-1',
    nombre: 'Factory Floor Monitoring',
    descripcion: 'Real-time monitoring of factory floor sensors',
    creadoEn: new Date('2024-01-15'),
    empresaId: 'company-1',
  },
  {
    id: 'project-2',
    nombre: 'Warehouse Temperature Control',
    descripcion: 'Temperature and humidity monitoring for warehouse',
    creadoEn: new Date('2024-02-20'),
    empresaId: 'company-1',
  },
  {
    id: 'project-3',
    nombre: 'Energy Management System',
    descripcion: 'Smart energy monitoring and optimization',
    creadoEn: new Date('2024-03-10'),
    empresaId: 'company-2',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  // TODO: for now we use mock data; replace with real backend calls later
  // when real data, no data with differents companies will be loaded together
  private projectsSignal = signal<Proyecto[]>(MOCK_PROJECTS);
  private selectedProjectIdSignal = signal<string | null>(null);

  projects = this.projectsSignal.asReadonly();
  selectedProjectId = this.selectedProjectIdSignal.asReadonly();

  getAll(): Proyecto[] {
    return this.projects();
  }

  selectProyecto(proyectoId?: string): void {
    let id = proyectoId;
    if (!id) {
      const all = this.getAll();
      if (all.length > 0) {
        id = all[0].id;
      }
    }
    if (id) {
      console.log('ProjectService: Selecting project', id);
      this.selectedProjectIdSignal.set(id);
    }
  }

  getByEmpresaId(empresaId: string): Proyecto[] {
    return this.projects().filter((p) => p.empresaId === empresaId);
  }

  getById(id: string): Proyecto | undefined {
    return this.projects().find((p) => p.id === id);
  }

  create(project: CreateProyectoDto): Proyecto {
    console.log('ProjectService: Creating project', project);
    //TODO: replace with true call to backend
    // for now, we mock the creation
    const newProject: Proyecto = {
      ...project,
      id: `project-${Math.random().toString(36).substr(2, 9)}`,
      creadoEn: new Date(),
      empresaId: 'company-1', // hardcoded for mock
    };
    this.projectsSignal.update((projects) => [...projects, newProject]);
    return newProject;
  }

  update(id: string, updates: Partial<Proyecto>): Proyecto | undefined {
    console.log('ProjectService: Updating project', id, updates);
    const project = this.getById(id);
    if (!project) return undefined;

    const updated = { ...project, ...updates };
    this.projectsSignal.update((projects) => projects.map((p) => (p.id === id ? updated : p)));
    return updated;
  }

  delete(id: string): boolean {
    console.log('ProjectService: Deleting project', id);
    const exists = this.getById(id) !== undefined;
    if (exists) {
      this.projectsSignal.update((projects) => projects.filter((p) => p.id !== id));
    }
    return exists;
  }
}
