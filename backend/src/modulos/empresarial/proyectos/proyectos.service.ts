import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { IsNull, Repository } from 'typeorm';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';
import {
  BaseTenantService,
  PerfilLike,
} from 'src/infraestructura/base-datos/base-tenant.service';

@Injectable()
export class ProyectosService extends BaseTenantService {
  private readonly logger = new Logger(ProyectosService.name);

  constructor(tenant: TenantConnectionHelper) {
    super(tenant);
  }

  private getProyectoRepo(perfil: PerfilLike): Promise<Repository<Proyecto>> {
    return this.getTenantRepo(perfil, Proyecto);
  }

  /** Crear proyecto */
  async create(perfil: PerfilLike, dto: CreateProyectoDto): Promise<Proyecto> {
    const repo = await this.getProyectoRepo(perfil);

    const proyecto = repo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      estado: dto.estado ?? true,
    });

    try {
      return await repo.save(proyecto);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('No se pudo crear el proyecto');
    }
  }

  /** Listar proyectos */
  async findAll(perfil: PerfilLike): Promise<Proyecto[]> {
    const repo = await this.getProyectoRepo(perfil);

    return repo.find({
      where: { borradoEn: IsNull() },
      order: { id: 'ASC' },
    });
  }

  /** Buscar proyecto por ID */
  async findOne(perfil: PerfilLike, id: number): Promise<Proyecto> {
    if (!Number.isInteger(id) || id <= 0)
      throw new BadRequestException('ID inválido');
    const repo = await this.getProyectoRepo(perfil);
    const proyecto = await repo.findOne({
      where: { id, borradoEn: IsNull() },
    });

    if (!proyecto) throw new NotFoundException(`Proyecto ${id} no encontrado`);

    return proyecto;
  }

  /** Actualizar proyecto */
  async update(
    perfil: PerfilLike,
    id: number,
    dto: UpdateProyectoDto,
  ): Promise<Proyecto> {
    const repo = await this.getProyectoRepo(perfil);
    const proyecto = await this.findOne(perfil, id);

    if (dto.nombre !== undefined) proyecto.nombre = dto.nombre;
    if (dto.descripcion !== undefined) proyecto.descripcion = dto.descripcion;
    if (dto.estado !== undefined) proyecto.estado = dto.estado;

    try {
      return await repo.save(proyecto);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error actualizando proyecto');
    }
  }

  /** Soft delete */
  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getProyectoRepo(perfil);

    await this.findOne(perfil, id); // validar que existe y no está borrado

    try {
      await repo.softDelete(id);
      return { message: `Proyecto ${id} eliminado correctamente` };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Error borrando proyecto');
    }
  }
}
