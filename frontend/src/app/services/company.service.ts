import { Injectable, signal } from '@angular/core';
import { Company } from '../models/company.model';

const MOCK_COMPANIES: Company[] = [
  {
    id: 'company-1',
    name: 'Acme Corporation',
    description: 'Leading industrial automation company',
    email: 'contact@acme.com',
    phone: '+1234567890',
    contactPerson: 'John Doe',
    status: 'active'
  },
  {
    id: 'company-2',
    name: 'Tech Solutions Inc',
    description: 'IoT and sensor solutions provider',
    email: 'info@techsolutions.com',
    phone: '+0987654321',
    contactPerson: 'Jane Smith',
    status: 'active'
  },
  {
    id: 'company-3',
    name: 'Global Sensors Ltd',
    description: 'Worldwide sensor network operator',
    email: 'hello@globalsensors.com',
    phone: '+1122334455',
    contactPerson: 'Bob Johnson',
    status: 'suspended'
  }
];

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companiesSignal = signal<Company[]>(MOCK_COMPANIES);
  private selectedCompanyIdSignal = signal<string>('company-1');

  companies = this.companiesSignal.asReadonly();
  selectedCompanyId = this.selectedCompanyIdSignal.asReadonly();

  getAll(): Company[] {
    return this.companies();
  }

  getById(id: string): Company | undefined {
    return this.companies().find(c => c.id === id);
  }

  selectCompany(companyId: string): void {
    console.log('CompanyService: Selecting company', companyId);
    this.selectedCompanyIdSignal.set(companyId);
  }

  create(company: Omit<Company, 'id'>): Company {
    const newCompany: Company = {
      ...company,
      id: `company-${Date.now()}`
    };
    console.log('CompanyService: Creating company', newCompany);
    this.companiesSignal.update(companies => [...companies, newCompany]);
    return newCompany;
  }

  update(id: string, updates: Partial<Company>): Company | undefined {
    console.log('CompanyService: Updating company', id, updates);
    const company = this.getById(id);
    if (!company) return undefined;

    const updated = { ...company, ...updates };
    this.companiesSignal.update(companies =>
      companies.map(c => c.id === id ? updated : c)
    );
    return updated;
  }

  delete(id: string): boolean {
    console.log('CompanyService: Deleting company', id);
    const exists = this.getById(id) !== undefined;
    if (exists) {
      this.companiesSignal.update(companies =>
        companies.filter(c => c.id !== id)
      );
    }
    return exists;
  }
}
