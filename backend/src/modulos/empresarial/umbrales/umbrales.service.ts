import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateUmbralDto } from './dto/create-umbral.dto';
import { UpdateUmbralDto } from './dto/update-umbral.dto';
import { Umbral } from './entities/umbral.entity';
import { Sensor } from '../sensores/entities/sensor.entity';
import { Variable } from '../variables/entities/variable.entity';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';
import { BaseTenantService, PerfilLike } from 'src/infraestructura/base-datos/base-tenant.service';

@Injectable()
export class UmbralesService extends BaseTenantService {
  private readonly logger = new Logger(UmbralesService.name);

  constructor(tenant: TenantConnectionHelper) {
    super(tenant);
  }

  private getUmbralRepo(perfil: PerfilLike): Promise<Repository<Umbral>> {
    return this.getTenantRepo(perfil, Umbral);
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

  async create(perfil: PerfilLike, dto: CreateUmbralDto): Promise<Umbral> {
    const repo = await this.getUmbralRepo(perfil);

    const umbral = repo.create({
      valorMin: dto.valorMin,
      valorMax: dto.valorMax,
      estado: dto.estado ?? true,
      borrado: false,
    } as Partial<Umbral>);

    if (dto.sensorId) umbral.sensor = await this.validarSensor(perfil, dto.sensorId);
    if (dto.variableId) umbral.variable = await this.validarVariable(perfil, dto.variableId);

    try {
      return await repo.save(umbral);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('No se pudo crear el umbral');
    }
  }

  async findAll(perfil: PerfilLike): Promise<Umbral[]> {
    const repo = await this.getUmbralRepo(perfil);
    return repo.find({ where: { borrado: false }, order: { id: 'ASC' }, relations: ['sensor', 'variable'] });
  }

  async findOne(perfil: PerfilLike, id: number): Promise<Umbral> {
    if (!Number.isInteger(id) || id <= 0) throw new BadRequestException('ID inválido');

    const repo = await this.getUmbralRepo(perfil);
    const umbral = await repo.findOne({ where: { id, borrado: false }, relations: ['sensor', 'variable'] });

    if (!umbral) throw new NotFoundException(`Umbral ${id} no encontrado`);
    return umbral;
  }

  async update(perfil: PerfilLike, id: number, dto: UpdateUmbralDto) {
    const repo = await this.getUmbralRepo(perfil);

    try {
      const umbral = await repo.preload({
        id,
        ...(dto.valorMin !== undefined && { valorMin: dto.valorMin }),
        ...(dto.valorMax !== undefined && { valorMax: dto.valorMax }),
        ...(dto.estado !== undefined && { estado: dto.estado }),
      });

      if (!umbral) throw new NotFoundException(`Umbral ${id} no encontrado`);

      // 2. Validación y asignación de relaciones
      if (dto.sensorId !== undefined) {
        umbral.sensor = await this.validarSensor(perfil, dto.sensorId);
      }

      if (dto.variableId !== undefined) {
        umbral.variable = await this.validarVariable(perfil, dto.variableId);
      }

      // 3. Guardar
      await repo.save(umbral);

      // 4. Retornar el registro actualizado
      return this.findOne(perfil, id);

    } catch (error) {
      if (error instanceof QueryFailedError) {
        const d = error.driverError as { code?: string };

        if (d.code === '23505') throw new ConflictException('Ya existe un umbral para ese sensor y variable');
        if (d.code === '23503') throw new NotFoundException('Sensor o variable no existe');
      }

      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(error);
      throw new InternalServerErrorException('Error actualizando umbral');
    }
  }

  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getUmbralRepo(perfil);
    const umbral = await this.findOne(perfil, id);

    umbral.borrado = true;
    umbral.borradoEn = new Date();

    return repo.save(umbral);
  }
}
