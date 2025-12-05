import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { RolUsuario } from './entities/rol-usuario.entity';
import { UpdateRolUsuarioDto } from './dto/update-roles-usuario.dto';
import { CreateRolUsuarioDto } from './dto/create-roles-usuario.dto';

@Injectable()
export class RolesUsuariosService {
  constructor(
    @InjectRepository(RolUsuario)
    private readonly rolRepo: Repository<RolUsuario>,
  ) {}

  // ============================
  // Crear rol
  // ============================
  async create(dto: CreateRolUsuarioDto): Promise<RolUsuario> {
    const nombreNormalizado = dto.nombre.trim();

    if (!nombreNormalizado) {
      throw new BadRequestException('El nombre del rol es obligatorio');
    }

    const existe = await this.rolRepo.findOne({
      where: {
        nombre: nombreNormalizado,
        borradoEn: IsNull(),
      },
    });

    if (existe) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    const rol = this.rolRepo.create({
      nombre: nombreNormalizado,
      descripcion: dto.descripcion?.trim() || null,
    });

    return this.rolRepo.save(rol);
  }

  // ============================
  // Listar roles activos
  // ============================
  async findAll(): Promise<RolUsuario[]> {
    return this.rolRepo.find({
      where: { borradoEn: IsNull() },
      order: { id: 'ASC' },
    });
  }

  // ============================
  // Buscar rol por ID
  // ============================
  async findOne(id: number): Promise<RolUsuario> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }

    const rol = await this.rolRepo.findOne({
      where: { id, borradoEn: IsNull() },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    return rol;
  }

  // ============================
  // Actualizar un rol
  // ============================
  async update(id: number, dto: UpdateRolUsuarioDto): Promise<RolUsuario> {
    const rol = await this.findOne(id);

    if (dto.nombre) {
      const nombreNormalizado = dto.nombre.trim();

      const existe = await this.rolRepo.findOne({
        where: {
          nombre: nombreNormalizado,
          borradoEn: IsNull(),
        },
      });

      if (existe && existe.id !== id) {
        throw new ConflictException('Ya existe otro rol con ese nombre');
      }

      rol.nombre = nombreNormalizado;
    }

    if (dto.descripcion !== undefined) {
      rol.descripcion = dto.descripcion?.trim() || null;
    }

    if (dto.estado !== undefined) {
      rol.estado = dto.estado;
    }

    return this.rolRepo.save(rol);
  }

  // ============================
  // Borrado lógico (soft delete)
  // ============================
  async remove(id: number) {
    const rol = await this.findOne(id);

    rol.borradoEn = new Date();
    rol.estado = false; // opcional pero lógico: si está borrado, queda inactivo

    await this.rolRepo.save(rol);

    return { message: 'Rol eliminado correctamente' };
  }
}
