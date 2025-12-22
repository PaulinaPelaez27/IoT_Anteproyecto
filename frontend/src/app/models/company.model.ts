export type CompanyStatus = 'active' | 'inactive' | 'suspended';

export interface Company {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  contactPerson: string;
  status: CompanyStatus;
  logo?: string;
}
