import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';
import { CreateProjectDto } from '../components/monitoring/dtos/create-project.dto';
import { UpdateProjectDto } from '../components/monitoring/dtos/update-project.dto';

const MOCK_PROJECTS: Project[] = [
  {
    id: 'project-1',
    name: 'Factory Floor Monitoring',
    description: 'Real-time monitoring of factory floor sensors',
    createdAt: new Date('2024-01-15'),
    companyId: 'company-1',
  },
  {
    id: 'project-2',
    name: 'Warehouse Temperature Control',
    description: 'Temperature and humidity monitoring for warehouse',
    createdAt: new Date('2024-02-20'),
    companyId: 'company-1',
  },
  {
    id: 'project-3',
    name: 'Energy Management System',
    description: 'Smart energy monitoring and optimization',
    createdAt: new Date('2024-03-10'),
    companyId: 'company-2',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsSignal = signal<Project[]>(MOCK_PROJECTS);
  private selectedProjectIdSignal = signal<string | null>(null);

  projects = this.projectsSignal.asReadonly();
  selectedProjectId = this.selectedProjectIdSignal.asReadonly();

  getAll(): Project[] {
    return this.projects();
  }

  selectProject(projectId: string): void {
    console.log('ProjectService: Selecting project', projectId);
    this.selectedProjectIdSignal.set(projectId);
  }

  getByCompanyId(companyId: string): Project[] {
    return this.projects().filter((p) => p.companyId === companyId);
  }

  getById(id: string): Project | undefined {
    return this.projects().find((p) => p.id === id);
  }

  create(project: CreateProjectDto): Project {
    console.log('ProjectService: Creating project', project);
    //TODO: replace with true call to backend
    // for now, we mock the creation
    const newProject: Project = {
      ...project,
      id: `project-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      companyId: 'company-1', // hardcoded for mock
    };
    this.projectsSignal.update((projects) => [...projects, newProject]);
    return newProject;
  }

  update(id: string, updates: Partial<Project>): Project | undefined {
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
