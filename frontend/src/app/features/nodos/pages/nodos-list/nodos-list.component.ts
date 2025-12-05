import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NodosService } from '../../services/nodos.service';
import { Nodo } from '../../models/nodo.model';
import { ProyectosService } from '../../../proyectos/services/proyectos.service';
import { NodoCreateDialogComponent } from '../../components/nodo-create-dialog/nodo-create-dialog.component';
import { NodoEditDialogComponent } from '../../components/nodo-edit-dialog/nodo-edit-dialog.component';

@Component({
  selector: 'app-nodos-list',
  standalone: true,
  templateUrl: './nodos-list.component.html',
  styleUrls: ['./nodos-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class NodosListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'proyectoId',
    'estado',
    'acciones',
  ];

  dataSource = new MatTableDataSource<Nodo>([]);
  filterValue = '';
  proyectos: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly nodosService: NodosService,
    private readonly proyectosService: ProyectosService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.configFilterPredicate();
    this.loadNodos();
    this.loadProyectos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private configFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Nodo, filter: string) => {
      const term = filter.trim().toLowerCase();

      return (
        (data.nombre ?? '').toLowerCase().includes(term) ||
        (data.descripcion ?? '').toLowerCase().includes(term) ||
        String(data.proyectoId ?? '').includes(term)
      );
    };
  }

  loadNodos(): void {
    this.nodosService.getAll().subscribe({
      next: (nodos) => {
        this.dataSource.data = nodos;
      },
      error: (err) => console.error(err),
    });
  }

  loadProyectos(): void {
    this.proyectosService.getAll().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
      },
      error: (err) => console.error(err),
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter(): void {
    this.filterValue = '';
    this.applyFilter();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(NodoCreateDialogComponent, {
      width: '600px',
      data: { proyectos: this.proyectos },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.loadNodos();
      }
    });
  }

  openEditDialog(nodo: Nodo): void {
    const dialogRef = this.dialog.open(NodoEditDialogComponent, {
      width: '600px',
      data: {
        ...nodo,
        proyectos: this.proyectos,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.loadNodos();
      }
    });
  }

  onDelete(nodo: Nodo): void {
    if (!confirm(`¿Eliminar nodo "${nodo.nombre}"?`)) {
      return;
    }

    this.nodosService.delete(nodo.id).subscribe({
      next: () => this.loadNodos(),
      error: (err) => console.error(err),
    });
  }

  getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  trackByNodoId(index: number, nodo: Nodo): number {
    return nodo.id;
  }
}