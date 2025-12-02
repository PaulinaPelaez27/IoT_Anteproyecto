import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateConexionDto } from './dto/create-conexion.dto';
import { UpdateConexionDto } from './dto/update-conexion.dto';
import { Conexion } from './entities/conexion.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ConexionesService {
  constructor(
    @InjectRepository(Conexion)
    private readonly conexionRepo: Repository<Conexion>,
  ) {}

  // ==================================================
  // CREATE
  // ==================================================
  async create(dto: CreateConexionDto) {
    const ent = this.conexionRepo.create(dto);
    return this.conexionRepo.save(ent);
  }

  // ==================================================
  // FIND ALL
  // ==================================================
  async findAll() {
    return this.conexionRepo.find({
      where: { borradoEn: IsNull() },
      relations: ['empresa'],
    });
  }

  // ==================================================
  // FIND ONE
  // ==================================================
  async findOne(id: number) {
    const ent = await this.conexionRepo.findOne({
      where: { id, borradoEn: IsNull() },
      relations: ['empresa'],
    });

    if (!ent) throw new NotFoundException('Conexión no encontrada');
    return ent;
  }

  // ==================================================
  // UPDATE
  // ==================================================
  async update(id: number, dto: UpdateConexionDto) {
    const ent = await this.findOne(id);
    Object.assign(ent, dto);
    return this.conexionRepo.save(ent);
  }

  // ==================================================
  // SOFT DELETE
  // ==================================================
  async remove(id: number) {
    const ent = await this.findOne(id);
    await this.conexionRepo.softDelete(id);
    return { message: 'Conexión eliminada correctamente' };
  }

  // ==================================================
  // FIND BY EMPRESA ID
  // ==================================================
  async findByEmpresaId(empresaId: number): Promise<Conexion | null> {
    if (!empresaId) throw new BadRequestException('empresaId requerido');

    return this.conexionRepo.findOne({
      where: { empresaId, borradoEn: IsNull() },
      relations: ['empresa'],
    });
  }

  // ==================================================
  // VALIDACIÓN DB NAME
  // ==================================================
  private validateDatabaseName(dbName: string): void {
    const validPattern = /^[a-zA-Z0-9_]+$/;
    if (!validPattern.test(dbName)) {
      throw new BadRequestException(
        `Nombre de base de datos inválido: "${dbName}". Solo se permiten caracteres alfanuméricos y guiones bajos.`,
      );
    }
  }

  // ==================================================
  // CREAR CONEXIÓN DEFAULT PARA EMPRESA
  // ==================================================
  async createDefaultForEmpresa(empresaId: number, nombreEmpresa: string) {
    const sanitizedName = nombreEmpresa
      .toLowerCase()
      .replace(/[^a-z0-9_]/gi, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    const dbName = `empresa_${empresaId}_${sanitizedName.slice(0, 40)}`;

    await this.createDatabaseIfNotExists(dbName);

    const conexion = this.conexionRepo.create({
      empresaId,
      host: process.env.DB_HOST,
      puerto: Number(process.env.DB_PORT),
      usuario: process.env.DB_USER,
      contrasena: process.env.DB_PASS,
      nombreBaseDeDatos: dbName,
    });

    return this.conexionRepo.save(conexion);
  }

  // ==================================================
  // CREATE DB IF NOT EXISTS (ADMIN MODE)
  // ==================================================
  async createDatabaseIfNotExists(dbName: string) {
    this.validateDatabaseName(dbName);

    const adminDs = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'postgres',
    });

    try {
      await adminDs.initialize();

      const exists = await adminDs.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName],
      );

      if (exists.length === 0) {
        await adminDs.query(`CREATE DATABASE "${dbName}"`);
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'Error al crear base de datos para empresa',
      );
    } finally {
      await adminDs.destroy();
    }
  }

  // ==================================================
  // CREAR DATA SOURCE DINÁMICO
  // ==================================================
  async getTenantDataSourceForEmpresaId(empresaId: number) {
    const conexion = await this.findByEmpresaId(empresaId);
    if (!conexion)
      throw new NotFoundException('Conexión para empresa no encontrada');

    const ds = new DataSource({
      type: 'postgres',
      host: conexion.host,
      port: conexion.puerto,
      username: conexion.usuario,
      password: conexion.contrasena,
      database: conexion.nombreBaseDeDatos,
    });

    await ds.initialize();

    return { conexion, dataSource: ds };
  }
}
