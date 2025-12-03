import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Formularios
import { FormsModule } from '@angular/forms';

// Servicios y modelos
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';

@Component({
  selector: 'app-proyectos-list',
  standalone: true,
  templateUrl: './proyectos-list.component.html',
  styleUrls: ['./proyectos-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,

    // Angular Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class ProyectosListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'empresaId',
    'estado',
    'acciones',
  ];

  dataSource = new MatTableDataSource<Proyecto>([]);
  isLoading = false;
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly proyectosService: ProyectosService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.configFilterPredicate();
    this.loadProyectos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private configFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Proyecto, filter: string) => {
      const term = filter.trim().toLowerCase();

      return (
        (data.nombre ?? '').toLowerCase().includes(term) ||
        (data.descripcion ?? '').toLowerCase().includes(term) ||
        String(data.empresaId ?? '').includes(term)
      );
    };
  }

  loadProyectos(): void {
    this.isLoading = true;
    this.proyectosService.getAll().subscribe({
      next: (proyectos) => {
        this.dataSource.data = proyectos;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
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

  goToCreate(): void {
    this.router.navigate(['/proyectos/crear']);
  }

  goToEdit(proyecto: Proyecto): void {
    this.router.navigate(['/proyectos/editar', proyecto.id]);
  }

  onDelete(proyecto: Proyecto): void {
    if (!confirm(`¿Eliminar el proyecto "${proyecto.nombre}"?`)) return;

    this.proyectosService.delete(proyecto.id).subscribe(() => {
      this.loadProyectos();
    });
  }

  getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  trackByProyectoId(index: number, proyecto: Proyecto): number {
    return proyecto.id;
  }
}
