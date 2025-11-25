import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorador de roles.
 * Permite definir qué roles son requeridos para acceder a un endpoint.
 *
 * Ejemplo:
 *   @Roles('ADMIN', 'TECNICO')
 */
export const Roles = (...roles: string[]) =>
  SetMetadata(
    ROLES_KEY,
    roles.map((r) => r.toUpperCase()), // Normalización profesional
  );
