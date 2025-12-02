import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { IsNull, Repository } from 'typeorm';
import { Variable } from './entities/variable.entity';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';
import { BaseTenantService, PerfilLike } from 'src/infraestructura/base-datos/base-tenant.service';

@Injectable()
export class VariablesService extends BaseTenantService {
  private readonly logger = new Logger(VariablesService.name);

  constructor(tenant: TenantConnectionHelper) {
    super(tenant);
  }

  private getRepo(perfil: PerfilLike): Promise<Repository<Variable>> {
    return this.getTenantRepo(perfil, Variable);
  }

  /** Crear variable */
  async create(perfil: PerfilLike, dto: CreateVariableDto): Promise<Variable> {
    const repo = await this.getRepo(perfil);

    // Validar varJson único en registros activos
    const exists = await repo.findOne({
      where: { varJson: dto.varJson, borradoEn: IsNull() },
    });

    if (exists)
      throw new BadRequestException('varJson ya está en uso por otra variable');

    const variable = repo.create({
      nombre: dto.nombre,
      unidad: dto.unidad ?? null,
      descripcion: dto.descripcion ?? null,
      varJson: dto.varJson,
      estado: dto.estado ?? true,
    });

    try {
      return await repo.save(variable);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'No se pudo crear la variable para el sensor',
      );
    }
  }

  /** Listar variables */
  async findAll(perfil: PerfilLike): Promise<Variable[]> {
    const repo = await this.getRepo(perfil);
    return repo.find({
      where: { borradoEn: IsNull() },
      order: { id: 'ASC' },
    });
  }

  /** Buscar una variable */
  async findOne(perfil: PerfilLike, id: number): Promise<Variable> {
    if (!Number.isInteger(id) || id <= 0)
      throw new BadRequestException('ID inválido');

    const repo = await this.getRepo(perfil);

    const item = await repo.findOne({
      where: { id, borradoEn: IsNull() },
    });

    if (!item)
      throw new NotFoundException(`Variable ${id} no encontrada`);

    return item;
  }

  /** Actualizar variable */
  async update(perfil: PerfilLike, id: number, dto: UpdateVariableDto) {
    const repo = await this.getRepo(perfil);
    const item = await this.findOne(perfil, id);

    // Validar varJson único
    if (dto.varJson && dto.varJson !== item.varJson) {
      const exists = await repo.findOne({
        where: { varJson: dto.varJson, borradoEn: IsNull() },
      });

      if (exists)
        throw new BadRequestException('varJson ya está en uso por otra variable');
    }

    if (dto.nombre !== undefined) item.nombre = dto.nombre;
    if (dto.unidad !== undefined) item.unidad = dto.unidad;
    if (dto.descripcion !== undefined) item.descripcion = dto.descripcion;
    if (dto.varJson !== undefined) item.varJson = dto.varJson;
    if (dto.estado !== undefined) item.estado = dto.estado;

    try {
      return await repo.save(item);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Error actualizando la variable del sensor',
      );
    }
  }

  /** Soft delete */
  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getRepo(perfil);

    await this.findOne(perfil, id); // valida existencia

    try {
      await repo.softDelete(id);
      return { message: `Variable ${id} eliminada correctamente` };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Error borrando la variable del sensor',
      );
    }
  }
}