import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

import { Auth } from '../auth/entities/auth.entity';
import { Perfil } from '../perfiles/entities/perfil.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, Perfil]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
