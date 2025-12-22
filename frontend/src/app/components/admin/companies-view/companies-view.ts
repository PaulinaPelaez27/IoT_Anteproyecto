import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-companies-view',
  imports: [CommonModule],
  templateUrl: './companies-view.html',
  styleUrl: './companies-view.css',
})
export class CompaniesView {
  constructor(public companyService: CompanyService) {}
}
