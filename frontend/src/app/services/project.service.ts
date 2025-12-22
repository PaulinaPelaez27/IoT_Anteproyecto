import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';

const MOCK_PROJECTS: Project[] = [
  {
    id: 'project-1',
    name: 'Factory Floor Monitoring',
    description: 'Real-time monitoring of factory floor sensors',
    createdAt: new Date('2024-01-15'),
    companyId: 'company-1'
  },
  {
    id: 'project-2',
    name: 'Warehouse Temperature Control',
    description: 'Temperature and humidity monitoring for warehouse',
    createdAt: new Date('2024-02-20'),
    companyId: 'company-1'
  },
  {
    id: 'project-3',
    name: 'Energy Management System',
    description: 'Smart energy monitoring and optimization',
    createdAt: new Date('2024-03-10'),
    companyId: 'company-2'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSignal = signal<Project[]>(MOCK_PROJECTS);

  projects = this.projectsSignal.asReadonly();

  getAll(): Project[] {
    return this.projects();
  }

  getByCompanyId(companyId: string): Project[] {
    return this.projects().filter(p => p.companyId === companyId);
  }

  getById(id: string): Project | undefined {
    return this.projects().find(p => p.id === id);
  }

  create(project: Omit<Project, 'id'>): Project {
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`
    };
    console.log('ProjectService: Creating project', newProject);
    this.projectsSignal.update(projects => [...projects, newProject]);
    return newProject;
  }

  update(id: string, updates: Partial<Project>): Project | undefined {
    console.log('ProjectService: Updating project', id, updates);
    const project = this.getById(id);
    if (!project) return undefined;

    const updated = { ...project, ...updates };
    this.projectsSignal.update(projects =>
      projects.map(p => p.id === id ? updated : p)
    );
    return updated;
  }

  delete(id: string): boolean {
    console.log('ProjectService: Deleting project', id);
    const exists = this.getById(id) !== undefined;
    if (exists) {
      this.projectsSignal.update(projects =>
        projects.filter(p => p.id !== id)
      );
    }
    return exists;
  }
}
