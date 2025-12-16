import { Module } from '@nestjs/common';
import { AlertasUsuariosService } from './alertas-usuarios.service';
import { AlertasUsuariosController } from './alertas-usuarios.controller';
import { CommonModule } from '../../../infraestructura/base-datos/common-module';
import { BaseTenantService } from '../../../infraestructura/base-datos/base-tenant.service';

@Module({
  imports: [CommonModule],
  controllers: [AlertasUsuariosController],
  providers: [AlertasUsuariosService, BaseTenantService],
})
export class AlertasUsuariosModule {}
