import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConexionesService } from './conexiones.service';
import { ConexionesController } from './conexiones.controller';
import { Conexion } from './entities/conexion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conexion])],
  controllers: [ConexionesController],
  providers: [ConexionesService],
  exports: [ConexionesService],
})
export class ConexionesModule {}
