import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../guards/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la ruta no tiene roles requeridos → permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    if (!user.roles || user.roles.length === 0) {
      throw new ForbiddenException(
        'Tu cuenta no tiene roles asignados. Contacta al administrador.',
      );
    }

    // =================================
    // SOPORTE PROFESIONAL PARA MULTIROL
    // =================================

    const userRoles = user.roles.map((r: string) => r.toUpperCase());
    const needed = requiredRoles.map((r) => r.toUpperCase());

    // Si tiene alguno → permitido
    const hasRole = needed.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `No tienes permisos para esta acción. Se requiere uno de: ${needed.join(', ')}`,
      );
    }

    return true;
  }
}