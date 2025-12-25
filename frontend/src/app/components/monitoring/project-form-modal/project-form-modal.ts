import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../../../shared/ui/modal/modal.service';
import { ProjectService } from '../../../services/project.service';
import { CreateProjectDto } from '../dtos/create-project.dto';
import { UpdateProjectDto } from '../dtos/update-project.dto';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form (ngSubmit)="submit()">
      <input data-testid="name" [formControl]="name" />
      <input data-testid="description" [formControl]="description" />

      <button type="submit">
        {{ mode === 'create' ? 'Create' : 'Update' }}
      </button>
    </form>
  `,
})
export class ProjectFormModal implements OnInit {
  mode: 'create' | 'update' = 'create';
  projectId?: string;

  name = new FormControl('');
  description = new FormControl('');

  private modal = inject(ModalService);
  private projects = inject(ProjectService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.mode = 'update';
      this.projectId = id;
      const project = this.projects.getById(id);

      if (project) {
        this.name.setValue(project.name);
        this.description.setValue(project.description);
      }
    } else {
      this.mode = 'create';
    }
  }

  submit() {
    if (this.mode === 'create') {
      const newProject: CreateProjectDto = {
        name: this.name.value!,
        description: this.description.value!,
      };
      this.projects.create(newProject);
    } else if (this.projectId) {
      const updatedProject: UpdateProjectDto = {
        id: this.projectId,
        name: this.name.value!,
        description: this.description.value!,
      };
      this.projects.update(this.projectId, updatedProject);
    }

    this.modal.hide();
  }
}
