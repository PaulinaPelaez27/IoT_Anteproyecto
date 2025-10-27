import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './entities/auth.entity';
import { Conexion } from '../conexiones/entities/conexion.entity';
import { CommonModule } from 'src/common/common-module';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, Conexion]), CommonModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule],
})
export class AuthModule {}
