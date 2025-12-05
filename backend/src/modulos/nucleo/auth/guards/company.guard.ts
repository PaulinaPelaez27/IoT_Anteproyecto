import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CompanyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const empresaIdHeader = req.headers['empresa-id'];
    if (!empresaIdHeader) {
      throw new BadRequestException(
        'Debe enviar empresa-id en los headers'
      );
    }

    const empresaId = Number(empresaIdHeader);
    if (isNaN(empresaId) || empresaId <= 0) {
      throw new BadRequestException('empresa-id inválido');
    }

    const user = req.user;
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // ADMIN_GLOBAL puede ver cualquier empresa
    if (user.roles.includes('ADMIN_GLOBAL')) {
      return true;
    }

    // Si no es admin global, validar que la empresa esté en su lista de empresas
    if (!user.empresas.includes(empresaId)) {
      throw new ForbiddenException(
        `No tienes acceso a la empresa ${empresaId}`
      );
    }

    return true;
  }
}