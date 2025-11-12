import { Module } from '@nestjs/common';
import { RolesUsuariosService } from './roles-usuarios.service';
import { RolesUsuariosController } from './roles-usuarios.controller';

@Module({
  controllers: [RolesUsuariosController],
  providers: [RolesUsuariosService],
})
export class RolesUsuariosModule {}
