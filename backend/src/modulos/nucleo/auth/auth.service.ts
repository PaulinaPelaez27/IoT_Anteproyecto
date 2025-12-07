import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Auth } from './entities/auth.entity';
import { Perfil } from '../perfiles/entities/perfil.entity';

import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,

    private readonly jwtService: JwtService,
  ) { }

  // ============================================
  // LOGIN — MULTIROL + MULTIEMPRESA
  // ============================================
  async login(email: string, contrasena: string): Promise<LoginResponseDto> {
    const user = await this.authRepository.findOne({
      where: { email, borradoEn: IsNull() },
    });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    if (!user.estado) throw new UnauthorizedException('Usuario inactivo');

    const ok = await bcrypt.compare(contrasena, user.contrasena);
    if (!ok) throw new ConflictException('Credenciales incorrectas');

    // Perfiles activos
    const perfiles = await this.perfilRepository.find({
      where: {
        usuarioId: user.id,
        borradoEn: IsNull(),
      },
      relations: ['empresa', 'rol'],
    });

    const roles = perfiles
      .filter((p) => p.rol?.estado)
      .map((p) => p.rol.nombre);

    const empresas = perfiles
      .filter((p) => p.empresa?.estado)
      .map((p) => p.empresa.id);

    // === JWT ===
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      roles,
      empresas,
    });

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      roles,
      empresas,
      access_token: token,
    };
  }

  // ============================================
  // LISTAR USUARIOS POR EMPRESA
  // ============================================
  async findAllByEmpresa(empresaId: number) {
    return this.authRepository
      .createQueryBuilder('u')
      .innerJoin(
        'u.perfiles',
        'p',
        'p.empresaId = :emp AND p.borradoEn IS NULL',
        { emp: empresaId },
      )
      .leftJoinAndSelect('u.perfiles', 'perfiles', 'perfiles.borradoEn IS NULL')
      .leftJoinAndSelect('perfiles.rol', 'rol')
      .leftJoinAndSelect('perfiles.empresa', 'empresa')
      .where('u.borradoEn IS NULL')
      .getMany();
  }

  // ============================================
  // VER USUARIO
  // ============================================
  async findOne(id: number) {
    const user = await this.authRepository.findOne({
      where: { id, borradoEn: IsNull() },
      relations: ['perfiles', 'perfiles.rol', 'perfiles.empresa'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // ============================================
  // UPDATE USUARIO
  // ============================================
  async update(id: number, dto: any) {
    const user = await this.authRepository.findOne({
      where: { id, borradoEn: IsNull() },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.contrasena) {
      const salt = await bcrypt.genSalt();
      dto.contrasena = await bcrypt.hash(dto.contrasena, salt);
    }

    Object.assign(user, dto);

    return this.authRepository.save(user);
  }

  // ============================================
  // FIND ALL USERS
  // ============================================
  async findAll() {
    return this.authRepository.find({
      where: { borradoEn: IsNull() },
      select: ['id', 'nombre', 'email', 'estado'],
    });
  }

  // ============================================
  // SOFT DELETE
  // ============================================
  async remove(id: number) {
    const user = await this.authRepository.findOne({
      where: { id, borradoEn: IsNull() },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.authRepository.softDelete(id);

    return { message: 'Usuario eliminado correctamente' };
  }
}