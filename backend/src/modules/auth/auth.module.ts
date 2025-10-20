import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './entities/auth.entity';
import { Conexion } from '../conexiones/entities/conexion.entity';
import { TenantConnectionService } from '../../common/tenant-connection.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, Conexion])],
  controllers: [AuthController],
  providers: [AuthService, TenantConnectionService],
  exports: [TypeOrmModule],
})
export class AuthModule {}
