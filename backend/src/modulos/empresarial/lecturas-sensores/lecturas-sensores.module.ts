import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LecturasSensoresService } from './lecturas-sensores.service';
import { LecturasSensoresController } from './lecturas-sensores.controller';
import { CommonModule } from 'src/infraestructura/base-datos/common-module';
import { LecturasSensor } from './entities/lecturas-sensor.entity';
import { Sensor } from '../sensores/entities/sensor.entity';
import { Variable } from '../variables/entities/variable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LecturasSensor, Sensor, Variable]), CommonModule],
  controllers: [LecturasSensoresController],
  providers: [LecturasSensoresService],
})
export class LecturasSensoresModule { }
