import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Perfil } from './entities/perfil.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Empresa } from '../empresas/entities/empresa.entity';
import { RolUsuario } from '../roles-usuarios/entities/rol-usuario.entity';

import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfilesService {
  constructor(
    @InjectRepository(Perfil)
    private readonly perfilRepo: Repository<Perfil>,

    @InjectRepository(Auth)
    private readonly usuarioRepo: Repository<Auth>,

    @InjectRepository(Empresa)
    private readonly empresaRepo: Repository<Empresa>,

    @InjectRepository(RolUsuario)
    private readonly rolRepo: Repository<RolUsuario>,
  ) {}

  // ======================================================
  // CREATE PERFIL
  // ======================================================
  async create(dto: CreatePerfilDto): Promise<Perfil> {
    // Validar usuario
    const usuario = await this.usuarioRepo.findOne({
      where: { id: dto.usuarioId, borradoEn: IsNull() },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Validar empresa
    const empresa = await this.empresaRepo.findOne({
      where: { id: dto.empresaId, borradoEn: IsNull() },
    });
    if (!empresa) throw new NotFoundException('Empresa no encontrada');

    // Validar rol
    const rol = await this.rolRepo.findOne({
      where: { id: dto.rolId, borradoEn: IsNull() },
    });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    // Verificar duplicado
    const existente = await this.perfilRepo.findOne({
      where: {
        usuarioId: dto.usuarioId,
        empresaId: dto.empresaId,
        rolId: dto.rolId,
        borradoEn: IsNull(),
      },
    });

    if (existente) {
      throw new ConflictException(
        'El usuario ya tiene ese rol asignado en esa empresa',
      );
    }

    const perfil = this.perfilRepo.create({
      usuario,
      empresa,
      rol,
      estado: dto.estado ?? true,
    });

    return this.perfilRepo.save(perfil);
  }

  // ======================================================
  // FIND ALL
  // ======================================================
  async findAll(): Promise<Perfil[]> {
    return this.perfilRepo.find({
      where: { borradoEn: IsNull() },
      relations: ['usuario', 'empresa', 'rol'],
      order: { id: 'ASC' },
    });
  }

  // ======================================================
  // FIND ONE
  // ======================================================
  async findOne(id: number): Promise<Perfil> {
    const perfil = await this.perfilRepo.findOne({
      where: { id, borradoEn: IsNull() },
      relations: ['usuario', 'empresa', 'rol'],
    });

    if (!perfil) throw new NotFoundException('Perfil no encontrado');
    return perfil;
  }

  // ======================================================
  // UPDATE
  // ======================================================
  async update(id: number, dto: UpdatePerfilDto): Promise<Perfil> {
    const perfil = await this.findOne(id);

    if (dto.estado !== undefined) perfil.estado = dto.estado;

    return this.perfilRepo.save(perfil);
  }

  // ======================================================
  // SOFT DELETE
  // ======================================================
  async remove(id: number): Promise<void> {
    const perfil = await this.findOne(id);

    perfil.borradoEn = new Date();
    await this.perfilRepo.save(perfil);
  }
}