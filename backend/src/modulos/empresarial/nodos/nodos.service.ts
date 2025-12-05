import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
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

  private getProyectoRepo(perfil: PerfilLike): Promise<Repository<Proyecto>> {
    return this.getTenantRepo(perfil, Proyecto);
  }

  /** Valida que el proyecto exista */
  private async validarProyecto(perfil: PerfilLike, proyectoId: number): Promise<void> {
    const repo = await this.getProyectoRepo(perfil);

    const existe = await repo.findOne({
      where: { id: proyectoId, borradoEn: IsNull() },
      select: ['id'],
    });

    if (!existe) throw new NotFoundException(`Proyecto ${proyectoId} no encontrado`);
  }

  /** Crear Nodo */
  async create(perfil: PerfilLike, dto: CreateNodoDto): Promise<Nodo> {
    const repo = await this.getNodoRepo(perfil);

    if (!dto.proyectoId || dto.proyectoId <= 0) {
      throw new BadRequestException('proyectoId inválido');
    }

    await this.validarProyecto(perfil, dto.proyectoId);

    const nodo = repo.create({
      nombre: dto.nombre,
      ubicacion: dto.ubicacion ?? null,
      proyectoId: dto.proyectoId,
      estado: dto.estado ?? true,
    });

    try {
      return await repo.save(nodo);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('No se pudo crear el nodo');
    }
  }

  /** Listar Nodos */
  async findAll(perfil: PerfilLike): Promise<Nodo[]> {
    const repo = await this.getNodoRepo(perfil);

    return repo.find({
      where: { borradoEn: IsNull() },
      order: { id: 'ASC' },
      relations: ['proyecto'],
    });
  }

  /** Obtener Nodo por ID */
  async findOne(perfil: PerfilLike, id: number): Promise<Nodo> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }

    const repo = await this.getNodoRepo(perfil);

    const nodo = await repo.findOne({
      where: { id, borradoEn: IsNull() },
      relations: ['proyecto'],
    });

    if (!nodo) throw new NotFoundException(`Nodo ${id} no encontrado`);

    return nodo;
  }

  /** Actualizar Nodo */
  async update(perfil: PerfilLike, id: number, dto: UpdateNodoDto): Promise<Nodo> {
    const repo = await this.getNodoRepo(perfil);
    const nodo = await this.findOne(perfil, id);

    if (dto.proyectoId) {
      await this.validarProyecto(perfil, dto.proyectoId);
      nodo.proyectoId = dto.proyectoId;
    }

    if (dto.nombre !== undefined) nodo.nombre = dto.nombre;
    if (dto.ubicacion !== undefined) nodo.ubicacion = dto.ubicacion;
    if (dto.estado !== undefined) nodo.estado = dto.estado;

    try {
      return await repo.save(nodo);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error actualizando nodo');
    }
  }

  /** Soft delete */
  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getNodoRepo(perfil);

    await this.findOne(perfil, id); // valida existencia

    try {
      await repo.softDelete(id);
      return { message: `Nodo ${id} eliminado correctamente` };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error borrando nodo');
    }
  }
}
