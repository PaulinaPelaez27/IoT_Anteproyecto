import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertasService } from './alertas.service';
import { AlertasController } from './alertas.controller';
import { CommonModule } from 'src/infraestructura/base-datos/common-module';
import { Alerta } from './entities/alerta.entity';
import { Sensor } from '../sensores/entities/sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alerta, Sensor]), CommonModule],
  controllers: [AlertasController],
  providers: [AlertasService],
  exports: [AlertasService],
})
export class AlertasModule {}
