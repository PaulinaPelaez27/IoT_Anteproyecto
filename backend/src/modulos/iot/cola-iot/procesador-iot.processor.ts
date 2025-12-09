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
  ) {
    super();
  }

  // Método obligatorio para BullMQ
  async process(
    job: Job<{ empresaId: number; rawId: number }>,
  ): Promise<void> {
    const { empresaId, rawId } = job.data;

    this.logger.log(`Procesando RAW #${rawId} (empresa ${empresaId})`);

    const raw = await this.datosCrudosService.findById(rawId);
    if (!raw) {
      this.logger.warn(`RAW #${rawId} no encontrado`);
      return;
    }

    const data = raw.payload;

    try {
      // 1) Validar estructura
      if (!data.nodo || !data.sensor || data.valor === undefined) {
        throw new Error('Payload inválido: faltan nodo/sensor/valor');
      }

      // 2) Resolver Nodo
      const nodo = await this.nodoRepo.findOne({
        where: { uid: data.nodo, empresaId },
      });
      if (!nodo) {
        throw new Error(`Nodo ${data.nodo} no encontrado para empresa ${empresaId}`);
      }

      // 3) Resolver Sensor
      const sensor = await this.sensorRepo.findOne({
        where: { sensorUid: data.sensor, nodo: { id: nodo.id } },
        relations: ['nodo'],
      });
      if (!sensor) {
        throw new Error(`Sensor ${data.sensor} no encontrado en nodo ${nodo.id}`);
      }

      // 4) Resolver Variable
      const nombreVariable = data.variable ?? 'default';
      const variable = await this.variableRepo.findOne({
        where: { nombre: nombreVariable },
      });
      if (!variable) {
        throw new Error(`Variable ${nombreVariable} no encontrada`);
      }

      // 5) Crear lectura
      const lectura = this.lecturaRepo.create({
        sensor,
        variable,
        valor: Number(data.valor),
        timestamp: data.timestamp
          ? new Date(data.timestamp)
          : new Date(),
      });
      await this.lecturaRepo.save(lectura);

      // 6) Evaluar umbral y generar alerta si corresponde
      await this.evaluarUmbralYAlerta(lectura);

      // 7) Marcar RAW como procesado
      await this.datosCrudosService.marcarProcesado(raw.id);

      this.logger.log(`RAW #${rawId} procesado OK`);
    } catch (error: any) {
      this.logger.error(
        `Error procesando RAW #${rawId}: ${error.message}`,
      );
      await this.datosCrudosService.marcarError(raw.id, error.message);
      throw error; // para que BullMQ aplique reintentos
    }
  }

  private async evaluarUmbralYAlerta(lectura: LecturaSensor) {
    const umbral = await this.umbralRepo.findOne({
      where: {
        sensor: { id: lectura.sensor.id },
        variable: { id: lectura.variable.id },
        estado: true,
      },
      relations: ['sensor', 'variable'],
    });

    if (!umbral) return;

    const valor = lectura.valor;
    const abajo =
      umbral.minimo !== null &&
      umbral.minimo !== undefined &&
      valor < umbral.minimo;
    const arriba =
      umbral.maximo !== null &&
      umbral.maximo !== undefined &&
      valor > umbral.maximo;

    if (!abajo && !arriba) return;

    const mensaje = `Valor ${valor} fuera de rango [${umbral.minimo ?? '-∞'}, ${
      umbral.maximo ?? '+∞'
    }]`;

    const alerta = this.alertaRepo.create({
      sensor: lectura.sensor,
      variable: lectura.variable,
      valor,
      mensaje,
      timestamp: lectura.timestamp,
      resuelta: false,
    });

    await this.alertaRepo.save(alerta);
  }
}