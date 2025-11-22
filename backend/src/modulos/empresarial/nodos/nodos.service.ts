import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Nodo } from './entities/nodo.entity';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { CreateNodoDto } from './dto/create-nodo.dto';
import { UpdateNodoDto } from './dto/update-nodo.dto';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';
import { BaseTenantService, PerfilLike } from 'src/infraestructura/base-datos/base-tenant.service';

@Injectable()
export class NodosService extends BaseTenantService {
  private readonly logger = new Logger(NodosService.name);

  constructor(tenant: TenantConnectionHelper) {
    super(tenant);
  }

  private getNodoRepo(perfil: PerfilLike): Promise<Repository<Nodo>> {
    return this.getTenantRepo(perfil, Nodo);
  }

  async create(perfil: PerfilLike, dto: CreateNodoDto): Promise<Nodo> {
    const repo = await this.getNodoRepo(perfil);
    const entity = repo.create(dto);

    try {
      return await repo.save(entity);
    } catch (err) {
      throw new InternalServerErrorException('No se pudo crear el nodo');
    }
  }

  async findAll(perfil: PerfilLike): Promise<Nodo[]> {
    const repo = await this.getNodoRepo(perfil);
    return repo.find({ where: { borrado: false }, order: { id: 'ASC' } });
  }

  async findOne(perfil: PerfilLike, id: number): Promise<Nodo> {
    if (!Number.isInteger(id) || id <= 0)
      throw new BadRequestException('ID inválido');

    const repo = await this.getNodoRepo(perfil);
    const nodo = await repo.findOne({ where: { id, borrado: false } });

    if (!nodo) throw new NotFoundException(`Nodo ${id} no encontrado`);

    return nodo;
  }

  async update(perfil: PerfilLike, id: number, dto: UpdateNodoDto) {
    const repo = await this.getNodoRepo(perfil);
    const nodo = await this.findOne(perfil, id);

    Object.assign(nodo, dto);

    try {
      return await repo.save(nodo);
    } catch (err) {
      throw new InternalServerErrorException('Error actualizando nodo');
    }
  }

  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getNodoRepo(perfil);
    const nodo = await this.findOne(perfil, id);

    nodo.borrado = true;
    nodo.borradoEn = new Date();

    return repo.save(nodo);
  }
}
