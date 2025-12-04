import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NodosService } from '../../services/nodos.service';
import { NodoFormComponent } from '../nodo-form/nodo-form.component';

@Component({
  selector: 'app-nodo-edit-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Editar nodo</h2>

    <app-nodo-form
      [initialData]="data"
      [proyectos]="data.proyectos"
      (submitForm)="guardar($event)">
    </app-nodo-form>
  `,
  imports: [CommonModule, MatDialogModule, NodoFormComponent],
})
export class NodoEditDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<NodoEditDialogComponent>,
    private readonly nodosService: NodosService,
    private readonly snackBar: MatSnackBar,
  ) {}

  guardar(values: any): void {
    this.nodosService.update(this.data.id, values).subscribe({
      next: (res) => {
        this.snackBar.open('Nodo actualizado correctamente', 'Cerrar', {
          duration: 3000,
        });
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al actualizar el nodo', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}