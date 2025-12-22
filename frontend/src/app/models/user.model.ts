export type UserRole = 'admin' | 'tech' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  companyId: string;
}
