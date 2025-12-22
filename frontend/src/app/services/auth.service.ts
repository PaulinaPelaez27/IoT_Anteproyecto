import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>({
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    companyId: 'company-1'
  });

  currentUser = this.currentUserSignal.asReadonly();
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isTech = computed(() => this.currentUser()?.role === 'tech');
  isUser = computed(() => this.currentUser()?.role === 'user');
  canSwitchCompany = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'admin' || role === 'tech';
  });

  setUser(user: User): void {
    console.log('AuthService: Setting current user', user);
    this.currentUserSignal.set(user);
  }

  hasRole(roles: UserRole[]): boolean {
    const currentRole = this.currentUser()?.role;
    return currentRole ? roles.includes(currentRole) : false;
  }

  logout(): void {
    console.log('AuthService: Logging out');
    this.currentUserSignal.set(null);
  }
}
