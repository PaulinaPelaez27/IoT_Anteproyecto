import { Module } from '@nestjs/common';
import { SensoresService } from './sensores.service';
import { SensoresController } from './sensores.controller';
import { CommonModule } from 'src/infraestructura/base-datos/common-module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './entities/sensor.entity';
import { VariablesSoportaSensor } from '../variables-soporta-sensores/entities/variables-soporta-sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, VariablesSoportaSensor]), CommonModule],
  controllers: [SensoresController],
  providers: [SensoresService],
})
export class SensoresModule { }
