import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../../services/empresa.service';

@Component({
  selector: 'app-company-switcher',
  imports: [CommonModule],
  templateUrl: './company-switcher.html',
})
export class CompanySwitcher {
  constructor(public empresaService: EmpresaService) {}
}
