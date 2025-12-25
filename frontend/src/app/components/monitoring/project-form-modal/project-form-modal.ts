import { Component, Input, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
export class ProjectFormModal {
  @Input() mode: 'create' | 'update' = 'create';
  @Input() project?: CreateProjectDto | UpdateProjectDto;

  name = new FormControl('');
  description = new FormControl('');

  private modal = inject(ModalService);
  private projects = inject(ProjectService);

  ngOnInit() {
    if (this.mode === 'update' && this.project) {
      this.name.setValue(this.project.name);
      this.description.setValue(this.project.description);
    }
  }

  submit() {
    if (this.mode === 'create') {
      const newProject: CreateProjectDto = {
        name: this.name.value!,
        description: this.description.value!,
      };
      this.projects.create(newProject);
    } else if (this.project && 'id' in this.project) {
      const updatedProject: UpdateProjectDto = {
        id: this.project.id,
        name: this.name.value!,
        description: this.description.value!,
      };
      this.projects.update(this.project.id, updatedProject);
    }

    this.modal.hide();
  }
}
