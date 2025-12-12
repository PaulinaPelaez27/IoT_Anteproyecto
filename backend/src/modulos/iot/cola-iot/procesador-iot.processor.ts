// src/modulos/iot/cola-iot/procesador-iot.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DatosCrudosService } from 'src/modulos/nucleo/datos-crudos/datos-crudos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nodo } from '../../empresarial/nodos/entities/nodo.entity';
import { Sensor } from '../../empresarial/sensores/entities/sensor.entity';
import { Variable } from '../../empresarial/variables/entities/variable.entity';
import { LecturasSensor } from '../../empresarial/lecturas-sensores/entities/lecturas-sensor.entity';
import { Umbral } from '../../empresarial/umbrales/entities/umbral.entity';
import { Alerta } from '../../empresarial/alertas/entities/alerta.entity';
import { Logger } from '@nestjs/common';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';

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
    @InjectRepository(Nodo)
    private readonly nodoRepo: Repository<Nodo>,
    @InjectRepository(Sensor)
    private readonly sensorRepo: Repository<Sensor>,
    @InjectRepository(Variable)
    private readonly variableRepo: Repository<Variable>,
    @InjectRepository(LecturasSensor)
    private readonly lecturaRepo: Repository<LecturasSensor>,
    @InjectRepository(Umbral)
    private readonly umbralRepo: Repository<Umbral>,
    @InjectRepository(Alerta)
    private readonly alertaRepo: Repository<Alerta>,
    private readonly tenantConnectionHelper: TenantConnectionHelper,
  ) {
    super();
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

      //conectarse a la base de datos de la empresaId si es necesario
      const dataSource =
        await this.tenantConnectionHelper.getDataSource(empresaId);

      if (!dataSource) {
        throw new Error(
          `No se pudo obtener la conexión para la empresa ${empresaId}`,
        );
      }

      // recuperar variables necesarias segun el sensor
      const sensor = await dataSource.getRepository(Sensor).findOne({
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
