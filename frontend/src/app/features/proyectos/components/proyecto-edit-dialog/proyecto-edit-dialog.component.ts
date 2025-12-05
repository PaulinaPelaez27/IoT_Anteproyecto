import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ProyectoFormComponent } from '../proyecto-form/proyecto-form.component';
import { ProyectosService } from '../../services/proyectos.service';

@Component({
  selector: 'app-proyecto-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ProyectoFormComponent
  ],
  template: `
    <h2 mat-dialog-title>Editar proyecto</h2>

    <app-proyecto-form 
      [initialData]="data"
      (submitForm)="onSubmit($event)">
    </app-proyecto-form>
  `,
})
export class ProyectoEditDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<ProyectoEditDialogComponent>,
    private readonly proyectosService: ProyectosService
  ) {}

  onSubmit(values: any) {
    this.proyectosService.update(this.data.id, values).subscribe({
      next: (res) => this.dialogRef.close(res),
      error: (err) => console.error(err)
    });
  }
}
