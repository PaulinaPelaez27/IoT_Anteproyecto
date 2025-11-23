import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
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

  async create(perfil: PerfilLike, dto: CreateVariablesSoportaSensorDto): Promise<VariablesSoportaSensor> {
    const repo = await this.getRepo(perfil);
    const sensorRepo = await this.getSensorRepo(perfil);
    const variableRepo = await this.getVariableRepo(perfil);

    if (!dto.sensorId || !dto.variableId) throw new BadRequestException('sensorId y variableId son requeridos');

    const sensor = await sensorRepo.findOne({ where: { id: dto.sensorId, borrado: false } });
    if (!sensor) throw new NotFoundException(`Sensor ${dto.sensorId} no encontrado`);

    const variable = await variableRepo.findOne({ where: { id: dto.variableId, borrado: false } });
    if (!variable) throw new NotFoundException(`Variable ${dto.variableId} no encontrada`);

    const exists = await repo.findOne({ where: { vssIdSensor: dto.sensorId, vssIdVariable: dto.variableId } });
    if (exists) throw new BadRequestException('La relación ya existe');

    const entity = repo.create({
      vssIdSensor: dto.sensorId,
      vssIdVariable: dto.variableId,
      estado: dto.estado ?? true,
      borrado: false,
      sensor,
      variable,
    });

    try {
      return await repo.save(entity);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('No se pudo crear la relación sensor-variable');
    }
  }

  async findAll(perfil: PerfilLike): Promise<VariablesSoportaSensor[]> {
    const repo = await this.getRepo(perfil);
    return repo.find({ where: { borrado: false }, relations: ['sensor', 'variable'] });
  }

  async findOne(perfil: PerfilLike, sensorId: number, variableId: number): Promise<VariablesSoportaSensor> {
    if (!Number.isInteger(sensorId) || sensorId <= 0 || !Number.isInteger(variableId) || variableId <= 0)
      throw new BadRequestException('IDs inválidos');

    const repo = await this.getRepo(perfil);
    const item = await repo.findOne({ where: { vssIdSensor: sensorId, vssIdVariable: variableId, borrado: false }, relations: ['sensor', 'variable'] });
    if (!item) throw new NotFoundException('Relación no encontrada');
    return item;
  }

  async update(perfil: PerfilLike, sensorId: number, variableId: number, dto: UpdateVariablesSoportaSensorDto) {
    const repo = await this.getRepo(perfil);
    const item = await this.findOne(perfil, sensorId, variableId);

    Object.assign(item, dto);

    try {
      return await repo.save(item);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error actualizando relación');
    }
  }

  async remove(perfil: PerfilLike, sensorId: number, variableId: number) {
    const repo = await this.getRepo(perfil);
    const item = await this.findOne(perfil, sensorId, variableId);

    item.borrado = true;
    item.borradoEn = new Date();

    return repo.save(item);
  }
}
