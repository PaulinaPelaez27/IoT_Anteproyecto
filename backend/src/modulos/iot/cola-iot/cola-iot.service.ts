// src/modulos/iot/cola-iot/cola-iot.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ColaIotService {
  constructor(
    @InjectQueue('iot-processing')
    private readonly cola: Queue,
  ) {}

  async encolarProcesamiento(empresaId: number, rawId: number) {
    await this.cola.add(
      'procesar-dato-crudo',
      { empresaId, rawId },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 3000 },
        removeOnComplete: 1000,
        removeOnFail: 1000,
      },
    );
  }
}