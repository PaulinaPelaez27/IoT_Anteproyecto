import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Proyecto } from './entities/proyecto.entity';
import { Repository } from 'typeorm';
import { TenantConnectionHelper } from 'src/common/tenant-helpers';

type PerfilLike = { p_id_empresa?: number; empresa?: { e_id?: number } };

@Injectable()
export class ProyectosService {
  constructor(
    private readonly tenantConnectionHelper: TenantConnectionHelper,
  ) {}

  async create(perfil: PerfilLike, createProyectoDto: CreateProyectoDto) {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new Error('empresaId requerido');

    const ds = await this.tenantConnectionHelper.getDataSource(empresaId);
    if (!ds) throw new Error(`No tenant datasource for empresa ${empresaId}`);

    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const ent = repo.create(createProyectoDto as any);
    return repo.save(ent);
  }

  async findAll(perfil: PerfilLike) {
    console.log('ProyectosService.findAll called with perfil:', perfil);
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new Error('empresaId requerido');

    const ds = await this.tenantConnectionHelper.getDataSource(empresaId);
    if (!ds) throw new Error(`No tenant datasource for empresa ${empresaId}`);

    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const ent = repo.create(CreateProyectoDto as any);
    return repo.save(ent);
  }

  async findOne(perfil: PerfilLike, id: number) {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new Error('empresaId requerido');
    const ds = await this.tenantConnectionHelper.getDataSource(empresaId);
    if (!ds) throw new Error('No tenant datasource for empresa');
    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const p = await repo.findOne({ where: { id } as any });
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
    const ds = await this.tenantConnectionHelper.getDataSource(empresaId);
    if (!ds) throw new Error('No tenant datasource for empresa');
    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const ent = await this.findOne(perfil, id);
    Object.assign(ent, updateProyectoDto);
    return repo.save(ent as any);
  }

  async remove(perfil: PerfilLike, id: number) {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;
    if (!empresaId) throw new Error('empresaId requerido');
    const ds = await this.tenantConnectionHelper.getDataSource(empresaId);
    if (!ds) throw new Error('No tenant datasource for empresa');
    const repo: Repository<Proyecto> = ds.getRepository(Proyecto);
    const ent = await this.findOne(perfil, id);
    ent.borrado = true;
    ent.borradoEn = new Date();
    return repo.save(ent as any);
  }
}
