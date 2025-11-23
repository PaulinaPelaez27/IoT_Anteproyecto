import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Repository } from 'typeorm';
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

  async create(perfil: PerfilLike, dto: CreateVariableDto): Promise<Variable> {
    const repo = await this.getRepo(perfil);

    // verificar varJson único
    const exists = await repo.findOne({ where: { varJson: dto.varJson, borrado: false } });
    if (exists) throw new BadRequestException('varJson ya existe');

    const entity = repo.create({
      nombre: dto.nombre,
      unidad: dto.unidad,
      descripcion: dto.descripcion,
      varJson: dto.varJson,
      estado: dto.estado ?? true,
      borrado: false,
    });

    try {
      return await repo.save(entity);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('No se pudo crear la variable para el sensor');
    }
  }

  async findAll(perfil: PerfilLike): Promise<Variable[]> {
    const repo = await this.getRepo(perfil);
    return repo.find({ where: { borrado: false }, order: { id: 'ASC' } });
  }

  async findOne(perfil: PerfilLike, id: number): Promise<Variable> {
    if (!Number.isInteger(id) || id <= 0) throw new BadRequestException('ID inválido');

    const repo = await this.getRepo(perfil);
    const item = await repo.findOne({ where: { id, borrado: false } });
    if (!item) throw new NotFoundException(`Variable del sensor ${id} no encontrado`);
    return item;
  }

  async update(perfil: PerfilLike, id: number, dto: UpdateVariableDto) {
    const repo = await this.getRepo(perfil);
    const item = await this.findOne(perfil, id);

    if (dto.varJson && dto.varJson !== item.varJson) {
      const exists = await repo.findOne({ where: { varJson: dto.varJson, borrado: false } });
      if (exists && exists.id !== id) throw new BadRequestException('varJson ya existe');
    }

    Object.assign(item, dto);

    try {
      return await repo.save(item);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error actualizando la variable del sensor');
    }
  }

  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getRepo(perfil);
    const item = await this.findOne(perfil, id);

    item.borrado = true;
    item.borradoEn = new Date();

    return repo.save(item);
  }
}