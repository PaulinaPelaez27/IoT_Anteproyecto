import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolUsuario } from './entities/rol-usuario.entity';

@Injectable()
export class RolesUsuariosService {
  constructor(
    @InjectRepository(RolUsuario)
    private readonly rolRepo: Repository<RolUsuario>,
  ) {}

  // ============================
  // Crear rol
  // ============================
  async create(nombre: string, descripcion?: string): Promise<RolUsuario> {
    const existe = await this.rolRepo.findOneBy({
      nombre,
      borrado: false,
    });

    if (existe) throw new ConflictException('El rol ya existe');

    const rol = this.rolRepo.create({
      nombre,
      descripcion: descripcion ?? undefined,
      estado: true,
      borrado: false,
    });

    return this.rolRepo.save(rol);
  }

  // ============================
  // Listar roles activos
  // ============================
  async findAll(): Promise<RolUsuario[]> {
    return this.rolRepo.find({
      where: { borrado: false },
      order: { id: 'ASC' },
    });
  }

  // ============================
  // Buscar rol por ID
  // ============================
  async findOne(id: number): Promise<RolUsuario> {
    const rol = await this.rolRepo.findOneBy({
      id,
      borrado: false,
    });

    if (!rol) throw new NotFoundException('Rol no encontrado');

    return rol;
  }

  // ============================
  // Actualizar un rol
  // ============================
  async update(
    id: number,
    payload: { nombre?: string; descripcion?: string; estado?: boolean },
  ): Promise<RolUsuario> {
    const rol = await this.findOne(id);

    if (payload.nombre) {
      const existe = await this.rolRepo.findOneBy({
        nombre: payload.nombre,
        borrado: false,
      });

      if (existe && existe.id !== id)
        throw new ConflictException('Ya existe otro rol con ese nombre');

      rol.nombre = payload.nombre;
    }

    if (payload.descripcion !== undefined) {
      rol.descripcion = payload.descripcion;
    }

    if (payload.estado !== undefined) {
      rol.estado = payload.estado;
    }

    return this.rolRepo.save(rol);
  }

  // ============================
  // Borrado lógico
  // ============================
  async remove(id: number): Promise<void> {
    const rol = await this.findOne(id);

    rol.borrado = true;

    await this.rolRepo.save(rol);
  }
}
