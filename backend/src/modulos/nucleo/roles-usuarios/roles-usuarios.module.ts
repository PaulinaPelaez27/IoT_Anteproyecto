import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesUsuariosService } from './roles-usuarios.service';
import { RolesUsuariosController } from './roles-usuarios.controller';

import { RolUsuario } from './entities/rol-usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolUsuario]), // <<-- Muy importante
  ],
  controllers: [RolesUsuariosController],
  providers: [RolesUsuariosService],
  exports: [
    RolesUsuariosService,
    TypeOrmModule, // <<-- Para que otros módulos puedan usar el repo
  ],
})
export class RolesUsuariosModule {}
