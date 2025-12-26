import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-company-switcher',
  imports: [CommonModule],
  templateUrl: './company-switcher.html',
})
export class CompanySwitcher {
  constructor(public companyService: CompanyService) {}
}
