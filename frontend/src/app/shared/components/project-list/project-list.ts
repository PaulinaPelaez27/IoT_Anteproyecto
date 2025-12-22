import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Project } from '../../../models/project.model';
import { ButtonComponent } from '../../ui';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './project-list.html',
})
export class ProjectList {
  @Input() canCreateProject = false;
  @Input() loading = false;
  @Input() projects: Project[] = [];
  @Output() createProject = new EventEmitter<void>();
}
