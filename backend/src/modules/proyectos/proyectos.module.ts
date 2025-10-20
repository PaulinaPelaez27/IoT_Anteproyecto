import { Module } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { ProyectosController } from './proyectos.controller';
import { TenantConnectionService } from '../../common/tenant-connection.service';

@Module({
  controllers: [ProyectosController],
  providers: [ProyectosService, TenantConnectionService],
})
export class ProyectosModule {}
