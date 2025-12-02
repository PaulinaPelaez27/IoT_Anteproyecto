import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Auth } from '../auth/entities/auth.entity';
import { Perfil } from '../perfiles/entities/perfil.entity';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Auth)
    private readonly usuarioRepo: Repository<Auth>,

    @InjectRepository(Perfil)
    private readonly perfilRepo: Repository<Perfil>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Auth> {
    const existe = await this.usuarioRepo.findOne({
      where: { email: dto.email, borradoEn: IsNull() },
    });

    if (existe) throw new ConflictException('El email ya está registrado.');

    const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

    const user = this.usuarioRepo.create({
      nombre: dto.nombre.trim(),
      email: dto.email.toLowerCase(),
      contrasena: hashedPassword,
      // añade aquí otros campos si tu entidad Auth los tiene
    });

    return this.usuarioRepo.save(user);
  }

  async findAllByEmpresa(
    empresaId: number,
    usuarioJWT: JwtPayload,
  ): Promise<Auth[]> {
    if (!Number.isInteger(empresaId) || empresaId <= 0) {
      throw new BadRequestException('empresaId inválido');
    }

    // Solo restringimos si NO es ADMIN
    if (!usuarioJWT.roles.includes('ADMIN')) {
      if (
        !Array.isArray(usuarioJWT.empresas) ||
        !usuarioJWT.empresas.includes(empresaId)
      ) {
        throw new ForbiddenException('No puedes acceder a esta empresa.');
      }
    }

    return this.usuarioRepo
      .createQueryBuilder('u')
      .innerJoin(
        'u.perfiles',
        'p',
        'p.empresaId = :emp AND p.borradoEn IS NULL',
        { emp: empresaId },
      )
      .leftJoinAndSelect('u.perfiles', 'perfiles')
      .leftJoinAndSelect('perfiles.rol', 'rol')
      .leftJoinAndSelect('perfiles.empresa', 'empresa')
      .where('u.borradoEn IS NULL')
      .orderBy('u.id', 'ASC')
      .getMany();
  }

  async findOne(id: number): Promise<Auth> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }

    const user = await this.usuarioRepo.findOne({
      where: { id, borradoEn: IsNull() },
      relations: ['perfiles', 'perfiles.empresa', 'perfiles.rol'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Auth> {
    const user = await this.usuarioRepo.findOne({
      where: { id, borradoEn: IsNull() },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.contrasena) {
      dto.contrasena = await bcrypt.hash(dto.contrasena, 10);
    }

    Object.assign(user, dto);
    return this.usuarioRepo.save(user);
  }

  async remove(id: number): Promise<Auth> {
    const user = await this.usuarioRepo.findOne({
      where: { id, borradoEn: IsNull() },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.borradoEn = new Date();
    return this.usuarioRepo.save(user);
  }
}