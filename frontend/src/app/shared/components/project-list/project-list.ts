import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.html',
})
export class ProjectList {
  canCreateProject = true; // Placeholder logic
  loading = false;
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {
    this.fetchProjects();
  }

  fetchProjects() {
    this.loading = true;
    // Simulate async fetch; replace with real service call if available
    const result = this.projectService.projects();
    if (result instanceof Promise) {
      result.then((projects) => {
        this.projects = projects;
        this.loading = false;
      });
    } else {
      this.projects = result;
      this.loading = false;
    }
  }

  createProject() {
    // Logic to create a new project
    console.log('Creating a new project...');
  }

  // For template compatibility
  getProjects() {
    return this.projects;
  }
  isLoading() {
    return this.loading;
  }
}
