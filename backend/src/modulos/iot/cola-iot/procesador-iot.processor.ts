import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DatosCrudosService } from 'src/modulos/nucleo/datos-crudos/datos-crudos.service';
import { Sensor } from '../../empresarial/sensores/entities/sensor.entity';
import { Logger } from '@nestjs/common';
import { BaseTenantService } from 'src/infraestructura/base-datos/base-tenant.service';
import { Variable } from 'src/modulos/empresarial/variables/entities/variable.entity';
import { VariablesSoportaSensor } from 'src/modulos/empresarial/variables-soporta-sensores/entities/variables-soporta-sensor.entity';
import { LecturasSensor } from 'src/modulos/empresarial/lecturas-sensores/entities/lecturas-sensor.entity';

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

      // datosCrudos.mensaje tiene la estructura esperada : "{""sensor"": ""1"", ""energia"": ""2094.52"", ""humedad"": ""33.95"", ""voltaje"": ""12.68"", ""potencia"": ""705.13"", ""corriente"": ""0.47"", ""timestamp"": ""2025-12-13T21:23:35.064Z"", ""frecuencia"": ""14.91"", ""luminosidad"": ""982.38"", ""temperatura"": ""10.04"", ""angulo_desfase"": ""359.47"", ""factor_potencia"": ""0.31""}"

      // gestion mensaje para recuperar idSensor y variables
      // 1. convertir mensaje a objeto
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mensajeRaw =
        typeof datosCrudos.mensaje === 'string'
          ? JSON.parse(datosCrudos.mensaje)
          : datosCrudos.mensaje;

      // Adaptar a la estructura esperada
      const mensaje = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        sensor: Number(mensajeRaw.sensor),
        lecturas: Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          Object.entries(mensajeRaw)
            .filter(([k]) => k !== 'sensor' && k !== 'timestamp')
            .map(([k, v]) => [k, Number(v)]),
        ),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        timestamp: mensajeRaw.timestamp,
      };

      this.logger.log(
        `Mensaje recibido para RAW #${rawId}: Sensor ${mensaje.sensor}, Lecturas: ${JSON.stringify(
          mensaje.lecturas,
        )}, Timestamp: ${mensaje.timestamp}`,
      );

      // Usar BaseTenantService para obtener el repositorio
      const sensorRepo = await this.baseTenantService.getTenantRepo(
        { p_id_empresa: empresaId },
        Sensor,
      );

      const sensor = await sensorRepo.findOne({
        where: {
          id: mensaje.sensor,
          estado: true,
          nodoId: nodoId,
        },
        relations: [
          'variablesSoportaSensores',
          'variablesSoportaSensores.variable',
        ],
      });

      if (!sensor) {
        throw new Error(
          `Sensor no encontrado o inactivo: ID ${mensaje.sensor}`,
        );
      }

      const variableMap: Map<string, Variable> = new Map();
      sensor.variablesSoportaSensores.forEach((vss: VariablesSoportaSensor) => {
        if (vss.variable && vss.variable.estado) {
          variableMap.set(vss.variable.nombre.toLowerCase(), vss.variable);
        }
      });

      // Procesar lecturas
      for (const [nombreVar, valor] of Object.entries(mensaje.lecturas)) {
        const variable = variableMap.get(nombreVar);
        if (variable) {
          this.logger.log(
            `Procesando lectura - Sensor ID: ${sensor.id}, Variable: ${nombreVar}, Valor: ${valor}`,
          );
          // Aquí se implementaría la lógica para almacenar la lectura
          // 1. recuperar la repo de lecturas sensores
          const lecturaRepo = await this.baseTenantService.getTenantRepo(
            { p_id_empresa: empresaId },
            LecturasSensor,
          );

          const nuevaLectura = lecturaRepo.create({
            sensorId: sensor.id,
            variableId: variable.id,
            valor: valor.toString(),
          });
          await lecturaRepo.save(nuevaLectura);
          this.logger.log(
            `Lectura guardada - Sensor ID: ${sensor.id}, Variable ID: ${variable.id}, Valor: ${valor}`,
          );
        } else {
          this.logger.warn(
            `Variable no soportada o inactiva para el sensor ID ${sensor.id}: ${nombreVar}`,
          );
        }
      }

      this.logger.log(`Job completado para RAW #${rawId}`);
      return { success: true, rawId, empresaId, nodoId };
    } catch (error: unknown) {
      this.logger.error(`Error procesando job: ${(error as Error).message}`);
      throw error;
    }
  }
}
