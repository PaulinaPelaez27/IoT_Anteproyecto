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

type PerfilLike = { p_id_empresa?: number; empresa?: { e_id?: number } };

@Injectable()
export class NodosService {
  private readonly logger = new Logger(NodosService.name);

  constructor(private readonly tenantConnectionHelper: TenantConnectionHelper) { }

  /** Helper: obtiene repositorio del tenant */
  private async getRepo(perfil: PerfilLike): Promise<Repository<Nodo>> {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new BadRequestException('empresaId requerido');

    const ds = await this.tenantConnectionHelper.getDataSource(empresaId, [Nodo, Proyecto]);
    if (!ds) {
      throw new InternalServerErrorException(
        `No se pudo obtener la conexión para la empresa ${empresaId}`,
      );
    }

    return ds.getRepository(Nodo);
  }

  /** Helper: obtiene repo de proyectos del tenant */
  private async getProyectoRepo(perfil: PerfilLike): Promise<Repository<Proyecto>> {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) {
      throw new BadRequestException('empresaId requerido');
    }

    const ds = await this.tenantConnectionHelper.getDataSource(empresaId, [Proyecto]);
    if (!ds) {
      throw new InternalServerErrorException(
        `No se pudo obtener la conexión para la empresa ${empresaId}`,
      );
    }

    return ds.getRepository(Proyecto);
  }

  /** Helper: valida que el proyecto exista y no esté borrado */
  private async validarProyecto(
    perfil: PerfilLike,
    proyectoId: number,
  ): Promise<Proyecto> {
    const repo = await this.getProyectoRepo(perfil);
    const proyecto = await repo.findOne({ where: { id: proyectoId, borrado: false } });
    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${proyectoId} no encontrado o está borrado`,
      );
    }
    return proyecto;
  }

  /** Crear nodo */
  async create(perfil: PerfilLike, dto: CreateNodoDto): Promise<Nodo> {
    const repo = await this.getRepo(perfil);
    const { proyectoId, ...rest } = dto;

    const nodo = repo.create({
      ...rest,
      estado: rest.estado ?? true,
    });

    if (proyectoId) {
      nodo.proyecto = await this.validarProyecto(perfil, proyectoId);
    }

    try {
      const saved = await repo.save(nodo);
      this.logger.debug(`Nodo creado con ID=${saved.id}`);
      return saved;
    } catch (err) {
      this.logger.error('Error creando nodo', err);
      throw new InternalServerErrorException('No se pudo crear el nodo');
    }
  }

  /** Listar nodos */
  async findAll(perfil: PerfilLike): Promise<Nodo[]> {
    const repo = await this.getRepo(perfil);
    try {
      const nodos = await repo.find({
        where: { borrado: false },
        order: { id: 'ASC' },
      });
      this.logger.debug(`findAll: ${nodos.length} nodos encontrados`);
      return nodos;
    } catch (err) {
      this.logger.error('Error obteniendo nodos', err);
      throw new InternalServerErrorException('No se pudieron recuperar los nodos');
    }
  }

  /** Buscar un nodo por ID */
  async findOne(perfil: PerfilLike, id: number): Promise<Nodo> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID de nodo inválido');
    }

    const repo = await this.getRepo(perfil);
    const nodo = await repo.findOne({
      where: { id, borrado: false },
    });

    if (!nodo) throw new NotFoundException(`Nodo con ID ${id} no encontrado`);
    return nodo;
  }

  /** Actualizar nodo */
  async update(
    perfil: PerfilLike,
    id: number,
    dto: UpdateNodoDto,
  ): Promise<Nodo> {
    const repo = await this.getRepo(perfil);
    const nodo = await this.findOne(perfil, id);

    const { proyectoId, ...rest } = dto;
    Object.assign(nodo, rest);

    if (typeof proyectoId !== 'undefined') {
      nodo.proyecto = proyectoId
        ? await this.validarProyecto(perfil, proyectoId)
        : undefined;
    }

    try {
      const updated = await repo.save(nodo);
      this.logger.debug(`Nodo actualizado ID=${id}`);
      return updated;
    } catch (err) {
      this.logger.error(`Error actualizando nodo ID=${id}`, err);
      throw new InternalServerErrorException('Error actualizando nodo');
    }
  }

  /** Borrado lógico */
  async remove(perfil: PerfilLike, id: number): Promise<Nodo> {
    const repo = await this.getRepo(perfil);
    const nodo = await this.findOne(perfil, id);

    nodo.borrado = true;
    nodo.borradoEn = new Date();

    try {
      const removed = await repo.save(nodo);
      this.logger.debug(`Nodo marcado como borrado ID=${id}`);
      return removed;
    } catch (err) {
      this.logger.error(`Error eliminando nodo ID=${id}`, err);
      throw new InternalServerErrorException('Error eliminando nodo');
    }
  }
}
