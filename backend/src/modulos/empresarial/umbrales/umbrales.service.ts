import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Repository, QueryFailedError, IsNull } from 'typeorm';
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

  /** Validaciones */
  private async validarSensor(perfil: PerfilLike, sensorId: number): Promise<void> {
    const repo = await this.getSensorRepo(perfil);

    const existe = await repo.findOne({
      where: { id: sensorId, borradoEn: IsNull() },
      select: ['id'],
    });

    if (!existe) throw new NotFoundException(`Sensor ${sensorId} no encontrado`);
  }

  private async validarVariable(perfil: PerfilLike, variableId: number): Promise<void> {
    const repo = await this.getVariableRepo(perfil);

    const existe = await repo.findOne({
      where: { id: variableId, borradoEn: IsNull() },
      select: ['id'],
    });

    if (!existe) throw new NotFoundException(`Variable ${variableId} no encontrada`);
  }

  /** Crear umbral */
  async create(perfil: PerfilLike, dto: CreateUmbralDto): Promise<Umbral> {
    const repo = await this.getUmbralRepo(perfil);

    await this.validarSensor(perfil, dto.sensorId);
    await this.validarVariable(perfil, dto.variableId);

    const umbral = repo.create({
      valorMin: dto.valorMin ?? null,
      valorMax: dto.valorMax ?? null,
      sensorId: dto.sensorId,
      variableId: dto.variableId,
      estado: dto.estado ?? true,
    });

    try {
      return await repo.save(umbral);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof QueryFailedError) {
        const code = (err.driverError as any).code;
        if (code === '23505') {
          throw new ConflictException('Ya existe un umbral para ese sensor y variable');
        }
      }

      throw new InternalServerErrorException('No se pudo crear el umbral');
    }
  }

  /** Listar */
  async findAll(perfil: PerfilLike): Promise<Umbral[]> {
    const repo = await this.getUmbralRepo(perfil);

    return repo.find({
      where: { borradoEn: IsNull() },
      order: { id: 'ASC' },
      relations: ['sensor', 'variable'],
    });
  }

  /** Obtener uno */
  async findOne(perfil: PerfilLike, id: number): Promise<Umbral> {
    if (!Number.isInteger(id) || id <= 0)
      throw new BadRequestException('ID inválido');

    const repo = await this.getUmbralRepo(perfil);

    const umbral = await repo.findOne({
      where: { id, borradoEn: IsNull() },
      relations: ['sensor', 'variable'],
    });

    if (!umbral) throw new NotFoundException(`Umbral ${id} no encontrado`);

    return umbral;
  }

  /** Actualizar */
  async update(perfil: PerfilLike, id: number, dto: UpdateUmbralDto): Promise<Umbral> {
    const repo = await this.getUmbralRepo(perfil);

    const umbral = await this.findOne(perfil, id);

    if (dto.valorMin !== undefined) umbral.valorMin = dto.valorMin;
    if (dto.valorMax !== undefined) umbral.valorMax = dto.valorMax;
    if (dto.estado !== undefined) umbral.estado = dto.estado;

    if (dto.sensorId !== undefined) {
      await this.validarSensor(perfil, dto.sensorId);
      umbral.sensorId = dto.sensorId;
    }

    if (dto.variableId !== undefined) {
      await this.validarVariable(perfil, dto.variableId);
      umbral.variableId = dto.variableId;
    }

    try {
      await repo.save(umbral);
      return this.findOne(perfil, id);
    } catch (error) {
      this.logger.error(error);

      if (error instanceof QueryFailedError) {
        const code = (error.driverError as any).code;

        if (code === '23505')
          throw new ConflictException('Ya existe un umbral para ese sensor y variable');

        if (code === '23503')
          throw new NotFoundException('Sensor o variable no existe');
      }

      throw new InternalServerErrorException('Error actualizando umbral');
    }
  }

  /** Soft delete */
  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getUmbralRepo(perfil);

    await this.findOne(perfil, id); // validar existencia

    try {
      await repo.softDelete(id);
      return { message: `Umbral ${id} eliminado correctamente` };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error borrando umbral');
    }
  }
} 
