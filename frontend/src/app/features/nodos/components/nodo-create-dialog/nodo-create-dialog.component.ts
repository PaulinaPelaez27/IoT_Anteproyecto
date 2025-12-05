import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NodosService } from '../../services/nodos.service';
import { NodoFormComponent } from '../nodo-form/nodo-form.component';

@Component({
  selector: 'app-nodo-create-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Crear nodo</h2>

    <app-nodo-form
      [proyectos]="data.proyectos"
      (submitForm)="crear($event)">
    </app-nodo-form>
  `,
  imports: [CommonModule, MatDialogModule, NodoFormComponent],
})
export class NodoCreateDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<NodoCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly nodosService: NodosService,
    private readonly snackBar: MatSnackBar,
  ) {}

  crear(values: any): void {
    this.nodosService.create(values).subscribe({
      next: (res) => {
        this.snackBar.open('Nodo creado correctamente', 'Cerrar', {
          duration: 3000,
        });
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error al crear el nodo', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}