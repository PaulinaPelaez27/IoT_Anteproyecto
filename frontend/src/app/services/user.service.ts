import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';

const MOCK_USERS: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    companyId: 'company-1'
  },
  {
    id: '2',
    firstName: 'Tech',
    lastName: 'Specialist',
    email: 'tech@example.com',
    role: 'tech',
    status: 'active',
    companyId: 'company-1'
  },
  {
    id: '3',
    firstName: 'Regular',
    lastName: 'User',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    companyId: 'company-1'
  },
  {
    id: '4',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@techsolutions.com',
    role: 'tech',
    status: 'active',
    companyId: 'company-2'
  }
];

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSignal = signal<User[]>(MOCK_USERS);

  users = this.usersSignal.asReadonly();

  getAll(): User[] {
    return this.users();
  }

  getByCompanyId(companyId: string): User[] {
    return this.users().filter(u => u.companyId === companyId);
  }

  getById(id: string): User | undefined {
    return this.users().find(u => u.id === id);
  }

  create(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`
    };
    console.log('UserService: Creating user', newUser);
    this.usersSignal.update(users => [...users, newUser]);
    return newUser;
  }

  update(id: string, updates: Partial<User>): User | undefined {
    console.log('UserService: Updating user', id, updates);
    const user = this.getById(id);
    if (!user) return undefined;

    const updated = { ...user, ...updates };
    this.usersSignal.update(users =>
      users.map(u => u.id === id ? updated : u)
    );
    return updated;
  }

  delete(id: string): boolean {
    console.log('UserService: Deleting user', id);
    const exists = this.getById(id) !== undefined;
    if (exists) {
      this.usersSignal.update(users =>
        users.filter(u => u.id !== id)
      );
    }
    return exists;
  }
}
