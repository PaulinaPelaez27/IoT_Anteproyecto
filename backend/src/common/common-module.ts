// tenant-connection.module.ts
import { Module } from '@nestjs/common';
import { TenantConnectionHelper } from './tenant-helpers';
import { ConexionesModule } from 'src/modules/conexiones/conexiones.module';

@Module({
  imports: [ConexionesModule], // <- ConexionesModule doit exporter ConexionesService
  providers: [TenantConnectionHelper],
  exports: [TenantConnectionHelper],
})
export class CommonModule {}
