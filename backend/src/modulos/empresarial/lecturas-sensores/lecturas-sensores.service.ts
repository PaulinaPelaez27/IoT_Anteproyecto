import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { LecturasSensor } from './entities/lecturas-sensor.entity';
import { Sensor } from '../sensores/entities/sensor.entity';
import { Variable } from '../variables/entities/variable.entity';
import { CreateLecturasSensorDto } from './dto/create-lecturas-sensor.dto';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';
import { BaseTenantService, PerfilLike } from 'src/infraestructura/base-datos/base-tenant.service';

@Injectable()
export class LecturasSensoresService extends BaseTenantService {
  private readonly logger = new Logger(LecturasSensoresService.name);

  constructor(tenant: TenantConnectionHelper) {
    super(tenant);
  }

  private getLecturaRepo(perfil: PerfilLike): Promise<Repository<LecturasSensor>> {
    return this.getTenantRepo(perfil, LecturasSensor);
  }

  private getSensorRepo(perfil: PerfilLike): Promise<Repository<Sensor>> {
    return this.getTenantRepo(perfil, Sensor);
  }

  private getVariableRepo(perfil: PerfilLike): Promise<Repository<Variable>> {
    return this.getTenantRepo(perfil, Variable);
  }

  /** Valida que el sensor exista */
  private async validarSensor(perfil: PerfilLike, sensorId: number): Promise<void> {
    const repo = await this.getSensorRepo(perfil);

    const existe = await repo.findOne({
      where: { id: sensorId, borradoEn: IsNull() },
      select: ['id'],
    });

    if (!existe) throw new NotFoundException(`Sensor ${sensorId} no encontrado`);
  }

  /** Valida que la variable exista (solo si se envía variableId) */
  private async validarVariable(perfil: PerfilLike, variableId: number): Promise<void> {
    const repo = await this.getVariableRepo(perfil);

    const existe = await repo.findOne({
      where: { id: variableId, borradoEn: IsNull() },
      select: ['id'],
    });

    if (!existe) throw new NotFoundException(`Variable ${variableId} no encontrada`);
  }

  /** Crear lectura */
  async create(perfil: PerfilLike, dto: CreateLecturasSensorDto): Promise<LecturasSensor> {
    const repo = await this.getLecturaRepo(perfil);

    if (!dto.sensorId || dto.sensorId <= 0) {
      throw new BadRequestException('sensorId inválido');
    }

    await this.validarSensor(perfil, dto.sensorId);

    if (dto.variableId) {
      await this.validarVariable(perfil, dto.variableId);
    }

    const lectura = repo.create({
      valor: dto.valor,
      sensorId: dto.sensorId,
      variableId: dto.variableId ?? null,
      estado: true,
    });

    try {
      return await repo.save(lectura);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('No se pudo crear la lectura');
    }
  }

  /** Listar lecturas */
  async findAll(perfil: PerfilLike): Promise<LecturasSensor[]> {
    const repo = await this.getLecturaRepo(perfil);

    return repo.find({
      where: { borradoEn: IsNull() },
      order: { id: 'ASC' },
      relations: ['sensor', 'variable'],
    });
  }

  /** Obtener una lectura por id */
  async findOne(perfil: PerfilLike, id: number): Promise<LecturasSensor> {
    if (!Number.isInteger(id) || id <= 0)
      throw new BadRequestException('ID inválido');

    const repo = await this.getLecturaRepo(perfil);

    const lectura = await repo.findOne({
      where: { id, borradoEn: IsNull() },
      relations: ['sensor', 'variable'],
    });

    if (!lectura) throw new NotFoundException(`Lectura ${id} no encontrada`);

    return lectura;
  }

  /** Soft delete */
  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getLecturaRepo(perfil);

    // Verifica existencia
    await this.findOne(perfil, id);

    try {
      await repo.softDelete(id);
      return { message: `Lectura ${id} eliminada correctamente` };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error borrando lectura');
    }
  }
}
