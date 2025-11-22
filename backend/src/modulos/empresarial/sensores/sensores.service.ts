import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';
import { Nodo } from '../nodos/entities/nodo.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';

type PerfilLike = { p_id_empresa?: number; empresa?: { e_id?: number } };

@Injectable()
export class SensoresService {
  private readonly logger = new Logger(SensoresService.name);

  constructor(
    private readonly tenantConnectionHelper: TenantConnectionHelper,
  ) { }

  /** Helper: obtiene repo de sensores del tenant */
  private async getRepo(perfil: PerfilLike): Promise<Repository<Sensor>> {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new BadRequestException('empresaId requerido');

    const ds = await this.tenantConnectionHelper.getDataSource(empresaId);

    if (!ds) {
      throw new InternalServerErrorException(
        `No se pudo obtener la conexión para la empresa ${empresaId}`,
      );
    }

    return ds.getRepository(Sensor);
  }

  /** Helper: obtiene repo de nodos del tenant */
  private async getNodoRepo(perfil: PerfilLike): Promise<Repository<Nodo>> {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new BadRequestException('empresaId requerido');

    const ds = await this.tenantConnectionHelper.getDataSource(empresaId);

    if (!ds) {
      throw new InternalServerErrorException(
        `No se pudo obtener la conexión para la empresa ${empresaId}`,
      );
    }

    return ds.getRepository(Nodo);
  }

  /** Helper: valida que el nodo exista y no esté borrado */
  private async validarNodo(perfil: PerfilLike, nodoId: number): Promise<Nodo> {
    const repo = await this.getNodoRepo(perfil);

    const nodo = await repo.findOne({
      where: { id: nodoId, borrado: false },
    });

    if (!nodo) {
      throw new NotFoundException(
        `Nodo con ID ${nodoId} no encontrado o está borrado`,
      );
    }

    return nodo;
  }

  /** Crear sensor */
  async create(perfil: PerfilLike, dto: CreateSensorDto): Promise<Sensor> {
    const repo = await this.getRepo(perfil);
    const { nodoId, estado, ...rest } = dto;

    if (typeof nodoId === 'undefined' || !Number.isInteger(nodoId) || nodoId <= 0) {
      throw new BadRequestException('nodoId inválido o ausente');
    }
    if (!nodoId) {
      throw new BadRequestException('nodoId es requerido para crear un sensor');
    }

    const sensor = repo.create({
      ...rest,
      estado: estado ?? true, // por defecto true si no mandan nada
      borrado: false,
    });

    sensor.nodo = await this.validarNodo(perfil, nodoId);

    try {
      const saved = await repo.save(sensor);
      this.logger.debug(`Sensor creado con ID=${saved.id}`);
      return saved;
    } catch (err) {
      this.logger.error('Error creando sensor', err);
      throw new InternalServerErrorException('No se pudo crear el sensor');
    }
  }

  /** Listar sensores */
  async findAll(perfil: PerfilLike): Promise<Sensor[]> {
    const repo = await this.getRepo(perfil);
    try {
      const sensores = await repo.find({
        where: { borrado: false },
        order: { id: 'ASC' },
      });
      this.logger.debug(`findAll: ${sensores.length} sensores encontrados`);
      return sensores;
    } catch (err) {
      this.logger.error('Error obteniendo sensores', err);
      throw new InternalServerErrorException(
        'No se pudieron recuperar los sensores',
      );
    }
  }

  /** Buscar un sensor por ID */
  async findOne(perfil: PerfilLike, id: number): Promise<Sensor> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID de sensor inválido');
    }

    const repo = await this.getRepo(perfil);
    const sensor = await repo.findOne({
      where: { id, borrado: false },
      relations: ['nodo'],
    });

    if (!sensor) {
      throw new NotFoundException(`Sensor con ID ${id} no encontrado`);
    }

    return sensor;
  }

  /** Actualizar sensor */
  async update(
    perfil: PerfilLike,
    id: number,
    dto: UpdateSensorDto,
  ): Promise<Sensor> {
    const repo = await this.getRepo(perfil);
    const sensor = await this.findOne(perfil, id);

    const { nodoId, ...rest } = dto;

    Object.assign(sensor, rest);

    if (typeof nodoId !== 'undefined') {
      sensor.nodo = await this.validarNodo(perfil, nodoId);
    }


    try {
      const updated = await repo.save(sensor);
      this.logger.debug(`Sensor actualizado ID=${id}`);
      return updated;
    } catch (err) {
      this.logger.error(`Error actualizando sensor ID=${id}`, err);
      throw new InternalServerErrorException('Error actualizando sensor');
    }
  }

  /** Borrado lógico */
  async remove(perfil: PerfilLike, id: number): Promise<Sensor> {
    const repo = await this.getRepo(perfil);
    const sensor = await this.findOne(perfil, id);

    sensor.borrado = true;
    sensor.borradoEn = new Date();

    try {
      const removed = await repo.save(sensor);
      this.logger.debug(`Sensor marcado como borrado ID=${id}`);
      return removed;
    } catch (err) {
      this.logger.error(`Error eliminando sensor ID=${id}`, err);
      throw new InternalServerErrorException('Error eliminando sensor');
    }
  }
}