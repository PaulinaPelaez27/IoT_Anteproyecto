import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Perfil } from '../perfiles/entities/perfil.entity';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtPayload } from '../auth/jwt.strategy';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Perfil)
    private readonly perfilRepo: Repository<Perfil>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const emailNormalizado = dto.email.toLowerCase().trim();

    const existe = await this.usuarioRepo.findOne({
      where: { email: emailNormalizado, borradoEn: IsNull() },
    });

    if (existe) {
      throw new ConflictException('El email ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

    const user = this.usuarioRepo.create({
      nombre: dto.nombre.trim(),
      email: emailNormalizado,
      contrasena: hashedPassword,
    });

    try {
      return await this.usuarioRepo.save(user);
    } catch (error) {
      // Manejo de concurrencia: si dos usuarios intentan registrar el mismo email al mismo tiempo
      if (error.code === '23505') {
        throw new ConflictException('El email ya está registrado.');
      }
      throw new InternalServerErrorException('Error al registrar usuario.');
    }
  }

  async findAllByEmpresa(
    empresaId: number,
    usuarioJWT: JwtPayload,
  ): Promise<Usuario[]> {
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

  async findOne(id: number): Promise<Usuario> {
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

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
  const user = await this.usuarioRepo.findOne({
    where: { id, borradoEn: IsNull() },
  });

  if (!user) throw new NotFoundException('Usuario no encontrado');

  // --- VALIDAR EMAIL ÚNICO SI SE QUIERE CAMBIAR ---
  if (dto.email) {
    const emailNormalizado = dto.email.toLowerCase().trim();

    // Verificar si ya existe otro usuario con ese email
    const existe = await this.usuarioRepo.findOne({
      where: { email: emailNormalizado, borradoEn: IsNull() },
    });

    // Si existe y NO es este mismo usuario → conflicto
    if (existe && existe.id !== id) {
      throw new ConflictException('El email ya está registrado.');
    }

    dto.email = emailNormalizado;
  }

  // --- SI VIENE CONTRASEÑA, SE RE-HASHEA ---
  if (dto.contrasena) {
    dto.contrasena = await bcrypt.hash(dto.contrasena, 10);
  }

  // Asignamos cambios permitidos
  Object.assign(user, dto);

  try {
    return await this.usuarioRepo.save(user);
  } catch (error) {
    // Manejo de error de BD por si otro proceso genera un duplicado
    if (error.code === '23505') {
      throw new ConflictException('El email ya está registrado.');
    }
    throw new InternalServerErrorException('Error al actualizar usuario.');
  }
}

  async remove(id: number): Promise<Usuario> {
    const user = await this.usuarioRepo.findOne({
      where: { id, borradoEn: IsNull() },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.borradoEn = new Date();
    return this.usuarioRepo.save(user);
  }
}