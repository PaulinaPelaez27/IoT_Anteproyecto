import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Auth } from '../auth/entities/auth.entity';
import { Perfil } from '../perfiles/entities/perfil.entity';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Auth)
    private readonly usuarioRepo: Repository<Auth>,

    @InjectRepository(Perfil)
    private readonly perfilRepo: Repository<Perfil>,
  ) {}

  // ============================================================
  // CREAR USUARIO (solo ADMIN_GLOBAL)
  // ============================================================
  async create(dto: CreateUsuarioDto): Promise<Auth> {
    const existe = await this.usuarioRepo.findOne({
      where: { email: dto.email, borrado: false },
    });

    if (existe) throw new ConflictException('El email ya está registrado.');

    const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

    const user = this.usuarioRepo.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      contrasena: hashedPassword,
      estado: true,
      borrado: false,
    });

    return this.usuarioRepo.save(user);
  }

  // ============================================================
  // LISTAR USUARIOS POR EMPRESA
  // ADMIN_GLOBAL → cualquier empresa
  // ADMIN → solo sus empresas del JWT
  // ============================================================
  async findAllByEmpresa(empresaId: number, usuarioJWT: any) {
    // Verificar si el usuario es ADMIN_GLOBAL
    if (!usuarioJWT.roles.includes('ADMIN_GLOBAL')) {
      // Si es ADMIN normal, validar empresa
      if (!usuarioJWT.empresas.includes(empresaId)) {
        throw new ForbiddenException('No puedes acceder a esta empresa.');
      }
    }

    return this.usuarioRepo
      .createQueryBuilder('u')
      .innerJoin('u.perfiles', 'p', 'p.empresaId = :emp AND p.borrado = false', {
        emp: empresaId,
      })
      .leftJoinAndSelect('u.perfiles', 'perfiles')
      .leftJoinAndSelect('perfiles.rol', 'rol')
      .leftJoinAndSelect('perfiles.empresa', 'empresa')
      .where('u.borrado = false')
      .getMany();
  }

  // ============================================================
  // VER USUARIO
  // ============================================================
  async findOne(id: number): Promise<Auth> {
    const user = await this.usuarioRepo.findOne({
      where: { id, borrado: false },
      relations: ['perfiles', 'perfiles.empresa', 'perfiles.rol'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // ============================================================
  // UPDATE USUARIO
  // ============================================================
  async update(id: number, dto: UpdateUsuarioDto): Promise<Auth> {
    const user = await this.usuarioRepo.findOneBy({ id });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.contrasena) {
      dto.contrasena = await bcrypt.hash(dto.contrasena, 10);
    }

    Object.assign(user, dto);

    return this.usuarioRepo.save(user);
  }

  // ============================================================
  // BORRADO LÓGICO
  // ============================================================
  async remove(id: number) {
    const user = await this.usuarioRepo.findOneBy({ id });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.borrado = true;
    user.borradoEn = new Date();

    return this.usuarioRepo.save(user);
  }
}