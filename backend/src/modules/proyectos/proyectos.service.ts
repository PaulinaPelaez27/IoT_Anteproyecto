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
  private readonly logger: Logger;

  constructor(private readonly tenantConnectionHelper: TenantConnectionHelper) {
    // Inicializa el logger aquí para evitar que TypeScript emita
    // un parámetro constructor adicional (metadatos Object) que
    // causaría un error de inyección en Nest.
    this.logger = new Logger(ProyectosService.name);
  }

  async create(perfil: PerfilLike, createProyectoDto: CreateProyectoDto) {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new Error('empresaId requerido');

    const ds = await this.tenantConnectionHelper.getDataSource(empresaId, [
      Proyecto,
    ]);
    if (!ds) throw new Error(`No tenant datasource for empresa ${empresaId}`);

    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const ent = repo.create(createProyectoDto as Partial<Proyecto>);
    return repo.save(ent);
  }

  async findAll(perfil: PerfilLike): Promise<Proyecto[]> {
    this.logger.debug(`findAll called with perfil=${JSON.stringify(perfil)}`);

    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (empresaId == null) {
      throw new BadRequestException('x-empresa-id (empresaId) es requerido');
    }
    if (Number.isNaN(Number(empresaId)) || Number(empresaId) <= 0) {
      throw new BadRequestException('x-empresa-id debe ser un número válido');
    }

    try {
      const ds = await this.tenantConnectionHelper.getDataSource(
        Number(empresaId),
        [Proyecto],
      );
      const repo: Repository<Proyecto> = ds.getRepository(Proyecto);

      // Filtro predeterminado (no borrado)
      const items = await repo.find({
        where: { borrado: false },
        order: { id: 'ASC' }, // Adapta si tienes createdAt/updatedAt
      });

      this.logger.debug(
        `findAll: returning ${items.length} proyecto(s) for empresaId=${empresaId}`,
      );
      return items;
    } catch (err) {
      this.logger.error(
        `findAll failed for empresaId=${empresaId}`,
        err instanceof Error ? err.stack : String(err),
      );
      // Lanza un error HTTP controlado
      throw new InternalServerErrorException(
        'No se pudieron recuperar los proyectos',
      );
    }
  }

  async createSimple(perfil: PerfilLike, CreateProyectoDto: CreateProyectoDto) {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new Error('empresaId requerido');
    const ds = await this.tenantConnectionHelper.getDataSource(empresaId, [
      Proyecto,
    ]);
    if (!ds) throw new Error('No tenant datasource for empresa');
    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const ent = repo.create(CreateProyectoDto as Partial<Proyecto>);
    return repo.save(ent);
  }

  async findOne(perfil: PerfilLike, id: number) {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new Error('empresaId requerido');
    const ds = await this.tenantConnectionHelper.getDataSource(empresaId, [
      Proyecto,
    ]);
    if (!ds) throw new Error('No tenant datasource for empresa');
    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const p = await repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Proyecto not found');
    return p;
  }

  async update(
    perfil: PerfilLike,
    id: number,
    updateProyectoDto: UpdateProyectoDto,
  ) {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new Error('empresaId requerido');
    const ds = await this.tenantConnectionHelper.getDataSource(empresaId, [
      Proyecto,
    ]);
    if (!ds) throw new Error('No tenant datasource for empresa');
    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const ent = await this.findOne(perfil, id);
    Object.assign(ent, updateProyectoDto);
    return repo.save(ent);
  }

  async remove(perfil: PerfilLike, id: number) {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new Error('empresaId requerido');
    const ds = await this.tenantConnectionHelper.getDataSource(empresaId, [
      Proyecto,
    ]);
    if (!ds) throw new Error('No tenant datasource for empresa');
    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const ent = await this.findOne(perfil, id);
    ent.borrado = true;
    ent.borradoEn = new Date();
    return repo.save(ent);
  }
}
