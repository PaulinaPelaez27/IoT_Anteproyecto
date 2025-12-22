import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const hasAccess = authService.hasRole(allowedRoles);
    
    if (!hasAccess) {
      console.log('RoleGuard: Access denied. Redirecting to home.');
      router.navigate(['/']);
      return false;
    }

    return true;
  };
}
