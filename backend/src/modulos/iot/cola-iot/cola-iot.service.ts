import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ColaIotService {
  constructor(
    @InjectQueue('iot-processing')
    private cola: Queue,
  ) {}

  async encolarProcesamiento(data: any) {
    await this.cola.add('procesar-datos-iot', data);
  }
}
