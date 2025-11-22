import { Injectable, 
  NotFoundException, 
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { Repository } from 'typeorm';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';
import { BaseTenantService, PerfilLike } from 'src/infraestructura/base-datos/base-tenant.service';

@Injectable()
export class ProyectosService extends BaseTenantService {
  private readonly logger = new Logger(ProyectosService.name);

  constructor(tenant: TenantConnectionHelper) {
    super(tenant);
  }

  private getProyectoRepo(perfil: PerfilLike): Promise<Repository<Proyecto>> {
    return this.getTenantRepo(perfil, Proyecto);
  }

  async create(perfil: PerfilLike, dto: CreateProyectoDto) {
    const repo = await this.getProyectoRepo(perfil);
    const entity = repo.create(dto);

    try {
      return await repo.save(entity);
    } catch (err) {
      throw new InternalServerErrorException('No se pudo crear el proyecto');
    }
  }

  async findAll(perfil: PerfilLike) {
    const repo = await this.getProyectoRepo(perfil);
    return repo.find({ where: { borrado: false }, order: { id: 'ASC' } });
  }

  async findOne(perfil: PerfilLike, id: number) {
    if (!Number.isInteger(id) || id <= 0)
      throw new BadRequestException('ID inválido');

    const repo = await this.getProyectoRepo(perfil);
    const proyecto = await repo.findOne({
      where: { id, borrado: false },
    });

    if (!proyecto)
      throw new NotFoundException(`Proyecto ${id} no encontrado`);

    return proyecto;
  }

  async update(perfil: PerfilLike, id: number, dto: UpdateProyectoDto) {
    const repo = await this.getProyectoRepo(perfil);
    const proyecto = await this.findOne(perfil, id);

    Object.assign(proyecto, dto);

    try {
      return await repo.save(proyecto);
    } catch (err) {
      throw new InternalServerErrorException('Error actualizando proyecto');
    }
  }

  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getProyectoRepo(perfil);
    const proyecto = await this.findOne(perfil, id);

    proyecto.borrado = true;
    proyecto.borradoEn = new Date();

    return repo.save(proyecto);
  }
}
