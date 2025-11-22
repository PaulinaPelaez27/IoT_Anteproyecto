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

  private async validarNodo(perfil: PerfilLike, nodoId: number): Promise<Nodo> {
    const repo = await this.getNodoRepo(perfil);
    const nodo = await repo.findOne({ where: { id: nodoId, borrado: false } });

    if (!nodo)
      throw new NotFoundException(`Nodo ${nodoId} no encontrado`);

    return nodo;
  }

  async create(perfil: PerfilLike, dto: CreateSensorDto): Promise<Sensor> {
    const repo = await this.getSensorRepo(perfil);

    if (!dto.nodoId || dto.nodoId <= 0)
      throw new BadRequestException('nodoId inválido');

    const sensor = repo.create({
      ...dto,
      estado: dto.estado ?? true,
      borrado: false,
    });

    sensor.nodo = await this.validarNodo(perfil, dto.nodoId);

    try {
      return await repo.save(sensor);
    } catch (err) {
      throw new InternalServerErrorException('No se pudo crear el sensor');
    }
  }

  async findAll(perfil: PerfilLike): Promise<Sensor[]> {
    const repo = await this.getSensorRepo(perfil);
    return repo.find({
      where: { borrado: false },
      order: { id: 'ASC' },
    });
  }

  async findOne(perfil: PerfilLike, id: number): Promise<Sensor> {
    if (!Number.isInteger(id) || id <= 0)
      throw new BadRequestException('ID inválido');

    const repo = await this.getSensorRepo(perfil);
    const sensor = await repo.findOne({
      where: { id, borrado: false },
      relations: ['nodo'],
    });

    if (!sensor)
      throw new NotFoundException(`Sensor ${id} no encontrado`);

    return sensor;
  }

  async update(perfil: PerfilLike, id: number, dto: UpdateSensorDto) {
    const repo = await this.getSensorRepo(perfil);
    const sensor = await this.findOne(perfil, id);

    if (dto.nodoId) {
      sensor.nodo = await this.validarNodo(perfil, dto.nodoId);
    }

    Object.assign(sensor, dto);

    try {
      return await repo.save(sensor);
    } catch (err) {
      throw new InternalServerErrorException('Error actualizando sensor');
    }
  }

  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getSensorRepo(perfil);
    const sensor = await this.findOne(perfil, id);

    sensor.borrado = true;
    sensor.borradoEn = new Date();

    return repo.save(sensor);
  }
}