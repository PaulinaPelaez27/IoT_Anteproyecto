import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../shared/ui/';
import { ModalService } from '../../../shared/ui/modal/modal.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../services/project.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './project-form-modal.html',
})
export class ProjectFormModal {
  private fb = inject(FormBuilder);
  private modal = inject(ModalService);
  private projectService = inject(ProjectService);

  mode: 'create' | 'edit' = 'create';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.maxLength(255)]],
  });

  readonly isEdit = computed(() => this.mode === 'edit');

  constructor() {
    // if id is passed, set mode to edit and load data
    const route = inject(ActivatedRoute);
    const id = route.snapshot.paramMap.get('id');

    if (id) {
      this.mode = 'edit';
      const project = this.projectService.getById(id);
      if (project) {
        this.form.setValue({
          name: project.name,
          description: project.description,
        });
      }
    }
  }

  save() {
    console.log(this.form.value);
    if (this.form.invalid) return;

    const dto = this.form.getRawValue();
    // create or update via service
    if (this.isEdit()) {
      const route = inject(ActivatedRoute);
      const id = route.snapshot.paramMap.get('id');
      if (id) {
        console.log('Updating project', id, dto);
        //this.projectService.updateProject(id, dto);
      }
    } else {
      console.log('Creating project', dto);
      //this.projectService.createProject(dto);
    }

    this.close();
  }

  close() {
    this.modal.hide();
  }
}
