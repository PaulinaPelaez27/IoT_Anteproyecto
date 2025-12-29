import { Injectable, signal } from '@angular/core';
import { Empresa } from '../models/company.model';

const MOCK_COMPANIES: Empresa[] = [
  {
    id: 'company-1',
    nombre: 'Acme Corporation',
    descripcion: 'Leading industrial automation company',
    email: 'contact@acme.com',
    telefono: '+1234567890',
    personaContacto: 'John Doe',
    estado: true,
  },
  {
    id: 'company-2',
    nombre: 'Tech Solutions Inc',
    descripcion: 'IoT and sensor solutions provider',
    email: 'info@techsolutions.com',
    telefono: '+0987654321',
    personaContacto: 'Jane Smith',
    estado: true,
  },
  {
    id: 'company-3',
    nombre: 'Global Sensors Ltd',
    descripcion: 'Worldwide sensor network operator',
    email: 'hello@globalsensors.com',
    telefono: '+1122334455',
    personaContacto: 'Bob Johnson',
    estado: false,
  },
];

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private empresasSignal = signal<Empresa[]>(MOCK_COMPANIES);
  private selectedEmpresaIdSignal = signal<string>('company-1');

  empresas = this.empresasSignal.asReadonly();
  selectedEmpresaId = this.selectedEmpresaIdSignal.asReadonly();

  getAll(): Empresa[] {
    return this.empresas();
  }

  getById(id: string): Empresa | undefined {
    return this.empresas().find((c) => c.id === id);
  }

  selectEmpresa(empresaId: string): void {
    console.log('EmpresaService: Selecting empresa', empresaId);
    this.selectedEmpresaIdSignal.set(empresaId);
  }

  create(company: Omit<Empresa, 'id'>): Empresa {
    const newCompany: Empresa = {
      ...company,
      id: `company-${Date.now()}`,
    };
    console.log('EmpresaService: Creating empresa', newCompany);
    this.empresasSignal.update((empresas) => [...empresas, newCompany]);
    return newCompany;
  }

  update(id: string, updates: Partial<Empresa>): Empresa | undefined {
    console.log('EmpresaService: Updating empresa', id, updates);
    const company = this.getById(id);
    if (!company) return undefined;

    const updated = { ...company, ...updates };
    this.empresasSignal.update((empresas) => empresas.map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  delete(id: string): boolean {
    console.log('EmpresaService: Deleting empresa', id);
    const exists = this.getById(id) !== undefined;
    if (exists) {
      this.empresasSignal.update((empresas) => empresas.filter((c) => c.id !== id));
    }
    return exists;
  }
}
