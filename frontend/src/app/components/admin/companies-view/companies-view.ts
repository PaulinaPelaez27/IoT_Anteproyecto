import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../../services/empresa.service';

@Component({
  selector: 'app-companies-view',
  imports: [CommonModule],
  templateUrl: './companies-view.html',
  styleUrl: './companies-view.css',
})
export class CompaniesView {
  constructor(public empresaService: EmpresaService) {}
}
