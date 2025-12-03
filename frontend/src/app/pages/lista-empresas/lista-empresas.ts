//aqui se ponen todos los import, las funciones. Es como el cerebro de la pagina
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

export interface Empresa {
  id: number;
  nombre: string;
  descripcion?: string;
  email?: string;
  numeroTel?: string;
  responsable?: string;
  estado: boolean;
}

@Component({
  selector: 'app-lista-empresas', //manera de poder reutilizar la pagina/component en otra parte y 
  // se hace importandolo y ponieno <nombre-del-selector></nombre-del-selector>
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ], //aqui van los modulos que se van a usar en el html, si se va usar Material
  templateUrl: './lista-empresas.html',
  styleUrl: './lista-empresas.scss',
})
export class ListaEmpresas {
  empresas: Empresa[] = [
    {
      id: 1,
      nombre: 'Empresa A',
      descripcion: 'Descripcion de la Empresa A',
      email: 'empresaA@example.com',
      numeroTel: '123456789',
      responsable: 'Juan Perez',
      estado: true,
    }
  ]; //aqui se definen las variables que se van a usar en el html

 openCreateDialog() {
    // Lógica para abrir el diálogo de creación de empresa
  }

  trackByEmpresaId(index: number, empresa: Empresa): number {
    return empresa.id;
  }

  openUpdateDialog(empresa: Empresa) {
    // Lógica para abrir el diálogo de actualización de empresa
  }

  onDelete(empresa: Empresa) {
    // Lógica para eliminar la empresa
  }

}
