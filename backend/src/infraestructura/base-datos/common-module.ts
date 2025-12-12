// tenant-connection.module.ts
import { Module } from '@nestjs/common';
import { TenantConnectionHelper } from './tenant-helpers';
import { ConexionesModule } from '../../modulos/nucleo/conexiones/conexiones.module';

@Module({
  imports: [ConexionesModule], // <- ConexionesModule debe exportar ConexionesService
  providers: [TenantConnectionHelper],
  exports: [TenantConnectionHelper],
})
export class CommonModule {}
