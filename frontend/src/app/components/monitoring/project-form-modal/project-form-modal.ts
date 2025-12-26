import { Component, computed, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../shared/ui/';
import { ModalService } from '../../../shared/ui/modal/modal.service';
import { ActivatedRoute } from '@angular/router';
import { ProyectoService } from '../../../services/proyecto.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './project-form-modal.html',
})
export class ProjectFormModal {
  private fb = inject(FormBuilder);
  private modal = inject(ModalService);
  private proyectoService = inject(ProyectoService);

  mode: 'create' | 'edit' = 'create';

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.maxLength(255)]],
    estado: [true, [Validators.required]],
  });

  readonly isEdit = computed(() => this.mode === 'edit');
  readonly route = inject(ActivatedRoute);
  readonly id = this.route.snapshot.paramMap.get('id');

  constructor() {
    if (this.id) {
      this.mode = 'edit';
      const project = this.proyectoService.getById(this.id);
      if (project) {
        this.form.setValue({
          nombre: project.nombre,
          descripcion: project.descripcion || '',
          estado: project.estado || true,
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
      if (this.id) {
        console.log('Updating project', this.id, dto);
        //this.projectService.updateProject(this.id, dto);
      }
    } else {
      console.log('Creating project', dto);
      this.proyectoService.create(dto);
    }

    this.close();
  }

  close() {
    this.modal.hide();
  }
}
