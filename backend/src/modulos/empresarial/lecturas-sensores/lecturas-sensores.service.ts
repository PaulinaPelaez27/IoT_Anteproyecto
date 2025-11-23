import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { LecturasSensor } from './entities/lecturas-sensor.entity';
import { Sensor } from '../sensores/entities/sensor.entity';
import { Variable } from '../variables/entities/variable.entity';
import { CreateLecturasSensorDto } from './dto/create-lecturas-sensor.dto';
import { UpdateLecturasSensorDto } from './dto/update-lecturas-sensor.dto';
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

  private async validarSensor(perfil: PerfilLike, sensorId: number): Promise<Sensor> {
    const repo = await this.getSensorRepo(perfil);
    const sensor = await repo.findOne({ where: { id: sensorId, borrado: false } });

    if (!sensor) throw new NotFoundException(`Sensor ${sensorId} no encontrado`);

    return sensor;
  }

  private async validarVariable(perfil: PerfilLike, variableId: number): Promise<Variable> {
    const repo = await this.getVariableRepo(perfil);
    const variable = await repo.findOne({ where: { id: variableId, borrado: false } });

    if (!variable) throw new NotFoundException(`Variable ${variableId} no encontrada`);

    return variable;
  }

  async create(perfil: PerfilLike, dto: CreateLecturasSensorDto): Promise<LecturasSensor> {
    const repo = await this.getLecturaRepo(perfil);

    if (!dto.sensorId || dto.sensorId <= 0) throw new BadRequestException('sensorId inválido');

    const lectura = repo.create({
      valor: dto.valor,
      borrado: false,
    } as Partial<LecturasSensor>);

    lectura.sensor = await this.validarSensor(perfil, dto.sensorId);

    if (dto.variableId) {
      lectura.variable = await this.validarVariable(perfil, dto.variableId);
    }

    try {
      return await repo.save(lectura);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('No se pudo crear la lectura');
    }
  }

  async findAll(perfil: PerfilLike): Promise<LecturasSensor[]> {
    const repo = await this.getLecturaRepo(perfil);
    return repo.find({ where: { borrado: false }, order: { id: 'ASC' }, relations: ['sensor', 'variable'] });
  }

  async findOne(perfil: PerfilLike, id: number): Promise<LecturasSensor> {
    if (!Number.isInteger(id) || id <= 0) throw new BadRequestException('ID inválido');

    const repo = await this.getLecturaRepo(perfil);
    const lectura = await repo.findOne({ where: { id, borrado: false }, relations: ['sensor', 'variable'] });

    if (!lectura) throw new NotFoundException(`Lectura ${id} no encontrada`);

    return lectura;
  }

  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getLecturaRepo(perfil);
    const lectura = await this.findOne(perfil, id);

    lectura.borrado = true;
    lectura.borradoEn = new Date();

    return repo.save(lectura);
  }
}
