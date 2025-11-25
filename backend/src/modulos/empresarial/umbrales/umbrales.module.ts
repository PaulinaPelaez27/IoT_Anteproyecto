import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UmbralesService } from './umbrales.service';
import { UmbralesController } from './umbrales.controller';
import { CommonModule } from 'src/infraestructura/base-datos/common-module';
import { Umbral } from './entities/umbral.entity';
import { Sensor } from '../sensores/entities/sensor.entity';
import { Variable } from '../variables/entities/variable.entity';
import {UmbralRangoValidador} from './validador';

@Module({
  imports: [TypeOrmModule.forFeature([Umbral, Sensor, Variable]), CommonModule],
  controllers: [UmbralesController],
  providers: [UmbralesService, UmbralRangoValidador],
})
export class UmbralesModule { }
