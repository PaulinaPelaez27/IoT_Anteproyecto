import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { CreateVariablesSoportaSensorDto } from './dto/create-variables-soporta-sensor.dto';
import { UpdateVariablesSoportaSensorDto } from './dto/update-variables-soporta-sensor.dto';
import { VariablesSoportaSensor } from './entities/variables-soporta-sensor.entity';
import { Sensor } from '../sensores/entities/sensor.entity';
import { Variable } from '../variables/entities/variable.entity';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';
import { BaseTenantService, PerfilLike } from 'src/infraestructura/base-datos/base-tenant.service';

@Injectable()
export class VariablesSoportaSensoresService extends BaseTenantService {
  private readonly logger = new Logger(VariablesSoportaSensoresService.name);

  constructor(tenant: TenantConnectionHelper) {
    super(tenant);
  }

  private getRepo(perfil: PerfilLike): Promise<Repository<VariablesSoportaSensor>> {
    return this.getTenantRepo(perfil, VariablesSoportaSensor);
  }

  private getSensorRepo(perfil: PerfilLike): Promise<Repository<Sensor>> {
    return this.getTenantRepo(perfil, Sensor);
  }

  private getVariableRepo(perfil: PerfilLike): Promise<Repository<Variable>> {
    return this.getTenantRepo(perfil, Variable);
  }

  /* ============================================================
   * VALIDACIONES SENSOR & VARIABLE
   * ============================================================ */
  private async validarSensor(perfil: PerfilLike, id: number) {
    const repo = await this.getSensorRepo(perfil);
    const exists = await repo.findOne({
      where: { id, borradoEn: IsNull() },
      select: ['id'],
    });

    if (!exists) {
      throw new NotFoundException(`Sensor ${id} no encontrado`);
    }
  }

  private async validarVariable(perfil: PerfilLike, id: number) {
    const repo = await this.getVariableRepo(perfil);
    const exists = await repo.findOne({
      where: { id, borradoEn: IsNull() },
      select: ['id'],
    });

    if (!exists) {
      throw new NotFoundException(`Variable ${id} no encontrada`);
    }
  }

  /* ============================================================
   * CREATE
   * ============================================================ */
  async create(perfil: PerfilLike, dto: CreateVariablesSoportaSensorDto): Promise<VariablesSoportaSensor> {
    const repo = await this.getRepo(perfil);

    if (!dto.sensorId || !dto.variableId)
      throw new BadRequestException('sensorId y variableId son requeridos');

    await this.validarSensor(perfil, dto.sensorId);
    await this.validarVariable(perfil, dto.variableId);

    // Verificar si existe (con o sin borradoEn)
    const exists = await repo.findOneBy({
      vssIdSensor: dto.sensorId,
      vssIdVariable: dto.variableId,
    });

    if (exists && exists.borradoEn === null) {
      throw new BadRequestException('La relación ya existe');
    }

    // Crear nueva relación
    const entity = repo.create({
      vssIdSensor: dto.sensorId,
      vssIdVariable: dto.variableId,
      estado: dto.estado ?? true,
    });

    try {
      return await repo.save(entity);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('No se pudo crear la relación sensor-variable');
    }
  }

  /* ============================================================
   * FIND ALL
   * ============================================================ */
  async findAll(perfil: PerfilLike): Promise<VariablesSoportaSensor[]> {
    const repo = await this.getRepo(perfil);

    return repo.find({
      where: { borradoEn: IsNull() },
      relations: ['sensor', 'variable'],
    });
  }

  /* ============================================================
   * FIND ONE (PK compuesta + surrogate PK)
   * ============================================================ */
  async findOne(perfil: PerfilLike, sensorId: number, variableId: number): Promise<VariablesSoportaSensor> {
    if (!sensorId || !variableId)
      throw new BadRequestException('IDs inválidos');

    const repo = await this.getRepo(perfil);

    // 1. Buscar por PK compuesta (sin relations)
    const base = await repo.findOneBy({
      vssIdSensor: sensorId,
      vssIdVariable: variableId,
    });

    if (!base) {
      throw new NotFoundException('Relación no encontrada');
    }

    if (base.borradoEn !== null) {
      throw new NotFoundException('Relación no encontrada');
    }

    // 2. Cargar la entidad completa con relaciones usando surrogate PK (`id`)
    const full = await repo.findOne({
      where: { id: base.id },
      relations: ['sensor', 'variable'],
    });

    return full!;
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(
    perfil: PerfilLike,
    sensorId: number,
    variableId: number,
    dto: UpdateVariablesSoportaSensorDto,
  ): Promise<VariablesSoportaSensor> {
    const repo = await this.getRepo(perfil);

    const item = await this.findOne(perfil, sensorId, variableId);

    if (dto.estado !== undefined) {
      item.estado = dto.estado;
    }

    try {
      return await repo.save(item);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error actualizando relación');
    }
  }

  /* ============================================================
   * SOFT DELETE
   * ============================================================ */
  async remove(perfil: PerfilLike, sensorId: number, variableId: number) {
    const repo = await this.getRepo(perfil);

    const item = await this.findOne(perfil, sensorId, variableId);

    try {
      await repo.softDelete(item.id);
      return { message: `Relación ${sensorId}-${variableId} eliminada correctamente` };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error borrando relación');
    }
  }
}
