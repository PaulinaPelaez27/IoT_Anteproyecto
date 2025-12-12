import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DatosCrudosService } from 'src/modulos/nucleo/datos-crudos/datos-crudos.service';
import { Sensor } from '../../empresarial/sensores/entities/sensor.entity';
import { Logger } from '@nestjs/common';
import { BaseTenantService } from 'src/infraestructura/base-datos/base-tenant.service';

export interface IotJobData {
  rawId: number;
  empresaId: number;
  nodoId: number;
}

@Processor('iot-processing')
export class ProcesadorIot extends WorkerHost {
  private readonly logger = new Logger(ProcesadorIot.name);

  constructor(
    private readonly datosCrudosService: DatosCrudosService,
    private readonly baseTenantService: BaseTenantService,
  ) {
    super();
    this.logger.log('ProcesadorIot inicializado');
  }

  async process(job: Job<IotJobData>): Promise<any> {
    try {
      const { rawId, empresaId, nodoId }: IotJobData = job.data;

      this.logger.log(
        `Procesando job - RAW #${rawId}, Empresa ${empresaId}, Nodo ${nodoId}`,
      );

      const datosCrudos = await this.datosCrudosService.findOne(rawId);

      if (!datosCrudos) {
        throw new Error(`Datos crudos no encontrados: ${rawId}`);
      }

      // Procesar datos según nodo y empresa. !!! multi-tenant !!!

      // Usar BaseTenantService para obtener el repositorio
      const sensorRepo = await this.baseTenantService.getTenantRepo(
        { p_id_empresa: empresaId },
        Sensor,
      );

      // recuperar variables necesarias segun el sensor
      const sensor = await sensorRepo.findOne({
        where: { nodoId: nodoId },
        relations: ['variables'],
      });

      if (!sensor) {
        throw new Error(
          `Sensor no encontrado en nodoId: ${datosCrudos.nodoId}`,
        );
      }

      console.log('Sensor encontrado:', sensor);

      this.logger.log(`Job completado para RAW #${rawId}`);
      return { success: true, rawId, empresaId, nodoId };
    } catch (error: unknown) {
      this.logger.error(`Error procesando job: ${(error as Error).message}`);
      throw error;
    }
  }
}
