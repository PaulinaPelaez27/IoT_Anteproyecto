import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  // ============================================
  // Crear perfil (asignar usuario + empresa + rol)
  // ============================================
  async create(dto: CreatePerfilDto): Promise<Perfil> {
    const usuario = await this.usuarioRepo.findOneBy({
      id: dto.usuarioId,
      borrado: false,
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const empresa = await this.empresaRepo.findOneBy({
      id: dto.empresaId,
      borrado: false,
    });
    if (!empresa) throw new NotFoundException('Empresa no encontrada');

    const rol = await this.rolRepo.findOneBy({
      id: dto.rolId,
      borrado: false,
    });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    // Verificar duplicado
    const existente = await this.perfilRepo.findOneBy({
      usuarioId: dto.usuarioId,
      empresaId: dto.empresaId,
      rolId: dto.rolId,
      borrado: false,
    });

    if (existente)
      throw new ConflictException(
        'El usuario ya tiene ese rol asignado en esa empresa',
      );

    const perfil = this.perfilRepo.create({
      usuario,
      empresa,
      rol,
      estado: dto.estado ?? true,
      borrado: false,
    });

    return this.perfilRepo.save(perfil);
  }

  // Listar perfiles
  async findAll(): Promise<Perfil[]> {
    return this.perfilRepo.find({
      where: { borrado: false },
      relations: ['usuario', 'empresa', 'rol'],
      order: { id: 'ASC' },
    });
  }

  // Obtener perfil específico
  async findOne(id: number): Promise<Perfil> {
    const perfil = await this.perfilRepo.findOne({
      where: { id, borrado: false },
      relations: ['usuario', 'empresa', 'rol'],
    });

    if (!perfil) throw new NotFoundException('Perfil no encontrado');

    return perfil;
  }

  // Actualizar perfil
  async update(id: number, dto: UpdatePerfilDto): Promise<Perfil> {
    const perfil = await this.perfilRepo.findOneBy({ id });

    if (!perfil || perfil.borrado)
      throw new NotFoundException('Perfil no encontrado');

    if (dto.estado !== undefined) perfil.estado = dto.estado;

    if (dto.borrado === true) {
      perfil.borrado = true;
      perfil.borradoEn = new Date();
    }

    return this.perfilRepo.save(perfil);
  }

  // Eliminar perfil (borrado lógico)
  async remove(id: number): Promise<void> {
    const perfil = await this.perfilRepo.findOneBy({ id });

    if (!perfil || perfil.borrado)
      throw new NotFoundException('Perfil no encontrado');

    perfil.borrado = true;
    perfil.borradoEn = new Date();

    await this.perfilRepo.save(perfil);
  }
}