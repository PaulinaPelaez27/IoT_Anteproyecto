// src/app/features/empresas/pages/empresas-list/empresas-list.component.ts

import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
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

// Forms
import { FormsModule } from '@angular/forms';

// Servicio (✔ ADAPTADO A LA NUEVA ESTRUCTURA)
import { EmpresasService } from '../../services/empresas.service';
import { Empresa } from '../../models/empresa.model';

@Component({
  standalone: true,
  selector: 'app-empresas-list',
  templateUrl: './empresas-list.component.html',
  styleUrls: ['./empresas-list.component.scss'],
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
    MatProgressSpinnerModule,
  ],
})
export class EmpresasListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'nombre',
    'descripcion',
    'email',
    'numeroTel',
    'responsable',
    'estado',
    'acciones',
  ];

  dataSource = new MatTableDataSource<Empresa>([]);
  isLoading = false;
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly empresasService: EmpresasService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.configFilterPredicate();
    this.loadEmpresas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private configFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Empresa, filter: string) => {
      const term = filter.trim().toLowerCase();
      return (
        (data.nombre ?? '').toLowerCase().includes(term) ||
        (data.descripcion ?? '').toLowerCase().includes(term) ||
        (data.email ?? '').toLowerCase().includes(term) ||
        (data.numeroTel ?? '').toLowerCase().includes(term) ||
        (data.responsable ?? '').toLowerCase().includes(term)
      );
    };
  }

  loadEmpresas(): void {
    this.isLoading = true;
    this.empresasService.getAll().subscribe({
      next: (empresas) => {
        this.dataSource.data = empresas;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
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
    // futuramente: abrir dialog
  }

  openUpdateDialog(empresa: Empresa): void {}

  onDelete(empresa: Empresa): void {
    if (!confirm(`¿Seguro que deseas eliminar la empresa "${empresa.nombre}"?`)) {
      return;
    }

    this.empresasService.delete(empresa.id).subscribe(() => {
      this.loadEmpresas();
    });
  }

  getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  trackByEmpresaId(index: number, empresa: Empresa): number {
    return empresa.id;
  }
}