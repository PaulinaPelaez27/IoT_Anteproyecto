import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { Repository } from 'typeorm';
import { TenantConnectionHelper } from 'src/common/tenant-helpers';

type PerfilLike = { p_id_empresa?: number; empresa?: { e_id?: number } };

@Injectable()
export class ProyectosService {
  private readonly logger = new Logger(ProyectosService.name);

  constructor(
    private readonly tenantConnectionHelper: TenantConnectionHelper,
  ) { }

  /** Helper reutilizable para obtener el repositorio tenant */
  private async getRepo(perfil: PerfilLike): Promise<Repository<Proyecto>> {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) {
      throw new BadRequestException('empresaId requerido');
    }

    const ds = await this.tenantConnectionHelper.getDataSource(empresaId, [
      Proyecto,
    ]);
    if (!ds) {
      throw new InternalServerErrorException(
        `No se pudo obtener la conexión para la empresa ${empresaId}`,
      );
    }

    return ds.getRepository(Proyecto);
  }

  /** Crear proyecto */
  async create(perfil: PerfilLike, dto: CreateProyectoDto): Promise<Proyecto> {
    const repo = await this.getRepo(perfil);
    const entity = repo.create(dto as Partial<Proyecto>);
    try {
      const saved = await repo.save(entity);
      this.logger.debug(`Proyecto creado con ID=${saved.id}`);
      return saved;
    } catch (err) {
      this.logger.error('Error creando proyecto', err);
      throw new InternalServerErrorException('No se pudo crear el proyecto');
    }
  }

  /** Listar todos los proyectos activos */
  async findAll(perfil: PerfilLike): Promise<Proyecto[]> {
    const repo = await this.getRepo(perfil);
    try {
      const proyectos = await repo.find({
        where: { borrado: false },
        order: { id: 'ASC' },
      });
      this.logger.debug(`findAll: ${proyectos.length} proyectos encontrados`);
      return proyectos;
    } catch (err) {
      this.logger.error('Error obteniendo proyectos', err);
      throw new InternalServerErrorException(
        'No se pudieron recuperar los proyectos',
      );
    }
  }

  /** Buscar un proyecto por ID */
  async findOne(perfil: PerfilLike, id: number): Promise<Proyecto> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID de proyecto inválido');
    }

    const repo = await this.getRepo(perfil);
    const proyecto = await repo.findOne({ where: { id, borrado: false } });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    return proyecto;
  }

  /** Actualizar proyecto */
  async update(
    perfil: PerfilLike,
    id: number,
    dto: UpdateProyectoDto,
  ): Promise<Proyecto> {
    const repo = await this.getRepo(perfil);
    const proyecto = await this.findOne(perfil, id);

    Object.assign(proyecto, dto);

    try {
      const updated = await repo.save(proyecto);
      this.logger.debug(`Proyecto actualizado ID=${id}`);
      return updated;
    } catch (err) {
      this.logger.error(`Error actualizando proyecto ID=${id}`, err);
      throw new InternalServerErrorException('Error actualizando proyecto');
    }
  }

  /** Borrado lógico de proyecto */
  async remove(perfil: PerfilLike, id: number): Promise<Proyecto> {
    const repo = await this.getRepo(perfil);
    const proyecto = await this.findOne(perfil, id);

    proyecto.borrado = true;
    proyecto.borradoEn = new Date();

    try {
      const removed = await repo.save(proyecto);
      this.logger.debug(`Proyecto marcado como borrado ID=${id}`);
      return removed;
    } catch (err) {
      this.logger.error(`Error eliminando proyecto ID=${id}`, err);
      throw new InternalServerErrorException('Error eliminando proyecto');
    }
  }
}
