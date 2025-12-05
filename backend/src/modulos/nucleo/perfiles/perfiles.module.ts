import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilesService } from './perfiles.service';
import { PerfilesController } from './perfiles.controller';

import { Perfil } from './entities/perfil.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { RolUsuario } from '../roles-usuarios/entities/rol-usuario.entity';
import { RolesUsuariosModule } from '../roles-usuarios/roles-usuarios.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Perfil, Auth, Empresa, RolUsuario]),
    RolesUsuariosModule,
  ],
  controllers: [PerfilesController],
  providers: [PerfilesService],
  exports: [PerfilesService, TypeOrmModule],
})
export class PerfilesModule {}