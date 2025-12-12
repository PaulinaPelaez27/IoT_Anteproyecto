import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ColaIotService } from './cola-iot.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nodo } from '../../empresarial/nodos/entities/nodo.entity';
import { Sensor } from '../../empresarial/sensores/entities/sensor.entity';
import { Variable } from '../../empresarial/variables/entities/variable.entity';
import { LecturasSensor } from '../../empresarial/lecturas-sensores/entities/lecturas-sensor.entity';
import { Umbral } from '../../empresarial/umbrales/entities/umbral.entity';
import { Alerta } from '../../empresarial/alertas/entities/alerta.entity';
import { DatosCrudosModule } from 'src/modulos/nucleo/datos-crudos/datos-crudos.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'iot-processing',
    }),
    DatosCrudosModule,
    TypeOrmModule.forFeature([
      Nodo,
      Sensor,
      Variable,
      LecturasSensor,
      Umbral,
      Alerta,
    ]),
  ],
  providers: [ColaIotService],
  exports: [ColaIotService],
})
export class ColaIotModule {}
