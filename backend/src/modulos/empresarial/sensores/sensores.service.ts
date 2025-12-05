import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';
import { Nodo } from '../nodos/entities/nodo.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';
import { BaseTenantService, PerfilLike } from 'src/infraestructura/base-datos/base-tenant.service';

@Injectable()
export class SensoresService extends BaseTenantService {
  private readonly logger = new Logger(SensoresService.name);

  constructor(tenant: TenantConnectionHelper) {
    super(tenant);
  }

  private getSensorRepo(perfil: PerfilLike): Promise<Repository<Sensor>> {
    return this.getTenantRepo(perfil, Sensor);
  }

  private getNodoRepo(perfil: PerfilLike): Promise<Repository<Nodo>> {
    return this.getTenantRepo(perfil, Nodo);
  }

  /** Validación del nodo */
  private async validarNodo(perfil: PerfilLike, nodoId: number): Promise<void> {
    const repo = await this.getNodoRepo(perfil);

    const existe = await repo.findOne({
      where: { id: nodoId, borradoEn: IsNull() },
      select: ['id'],
    });

    if (!existe) throw new NotFoundException(`Nodo ${nodoId} no encontrado`);
  }

  /** Crear sensor */
  async create(perfil: PerfilLike, dto: CreateSensorDto): Promise<Sensor> {
    const repo = await this.getSensorRepo(perfil);

    if (!dto.nodoId || dto.nodoId <= 0) {
      throw new BadRequestException('nodoId inválido');
    }

    await this.validarNodo(perfil, dto.nodoId);

    const sensor = repo.create({
      nombre: dto.nombre,
      nodoId: dto.nodoId,
      estado: dto.estado ?? true,
    });

    try {
      return await repo.save(sensor);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('No se pudo crear el sensor');
    }
  }

  /** Listar sensores */
  async findAll(perfil: PerfilLike): Promise<Sensor[]> {
    const repo = await this.getSensorRepo(perfil);

    return repo.find({
      where: { borradoEn: IsNull() },
      order: { id: 'ASC' },
      relations: ['nodo'],
    });
  }

  /** Obtener sensor por ID */
  async findOne(perfil: PerfilLike, id: number): Promise<Sensor> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }

    const repo = await this.getSensorRepo(perfil);

    const sensor = await repo.findOne({
      where: { id, borradoEn: IsNull() },
      relations: ['nodo'],
    });

    if (!sensor)
      throw new NotFoundException(`Sensor ${id} no encontrado`);

    return sensor;
  }

  /** Actualizar sensor */
  async update(perfil: PerfilLike, id: number, dto: UpdateSensorDto): Promise<Sensor> {
    const repo = await this.getSensorRepo(perfil);
    const sensor = await this.findOne(perfil, id);

    if (dto.nodoId) {
      await this.validarNodo(perfil, dto.nodoId);
      sensor.nodoId = dto.nodoId;
    }

    if (dto.nombre !== undefined) sensor.nombre = dto.nombre;
    if (dto.estado !== undefined) sensor.estado = dto.estado;

    try {
      return await repo.save(sensor);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error actualizando sensor');
    }
  }

  /** Soft delete */
  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getSensorRepo(perfil);

    await this.findOne(perfil, id); // validar existencia

    try {
      await repo.softDelete(id);
      return { message: `Sensor ${id} eliminado correctamente` };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error borrando sensor');
    }
  }
}