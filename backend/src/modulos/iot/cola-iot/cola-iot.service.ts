import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IotJobData } from './procesador-iot.processor';

@Injectable()
export class ColaIotService {
  constructor(
    @InjectQueue('iot-processing')
    private cola: Queue,
  ) {}

  async encolarProcesamiento(data: IotJobData) {
    await this.cola.add('procesar-datos-iot', data);
  }
}
