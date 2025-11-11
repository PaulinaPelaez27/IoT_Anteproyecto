import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConexionDto } from './dto/create-conexion.dto';
import { UpdateConexionDto } from './dto/update-conexion.dto';
import { Conexion } from './entities/conexion.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ConexionesService {
  constructor(
    @InjectRepository(Conexion)
    private readonly conexionRepo: Repository<Conexion>,
  ) { }

  async create(createConexionDto: CreateConexionDto) {
    const ent = this.conexionRepo.create(createConexionDto);
    return this.conexionRepo.save(ent);
  }

  async findAll() {
    return this.conexionRepo.find({ where: { borrado: false } });
  }

  async findOne(id: number) {
    const e = await this.conexionRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Conexión no encontrada');
    return e;
  }

  async update(id: number, dto: UpdateConexionDto) {
    const ent = await this.findOne(id);
    Object.assign(ent, dto);
    return this.conexionRepo.save(ent);
  }

  async remove(id: number) {
    const ent = await this.findOne(id);
    ent.borrado = true;
    ent.borradoEn = new Date();
    return this.conexionRepo.save(ent);
  }

  async findByEmpresaId(empresaId: number): Promise<Conexion | null> {
    if (!empresaId) throw new Error('empresaId requerido');
    return this.conexionRepo.findOne({
      where: { empresaId, borrado: false },
    });
  }

  /**
   * Valida que el nombre de la base de datos contenga solo caracteres seguros.
   * Permite solo letras (a-z, A-Z), números (0-9) y guiones bajos (_).
   * @throws Error si el nombre contiene caracteres no permitidos
   */
  private validateDatabaseName(dbName: string): void {
    const validPattern = /^[a-zA-Z0-9_]+$/;
    if (!validPattern.test(dbName)) {
      throw new Error(
        `Nombre de base de datos inválido: "${dbName}". Solo se permiten caracteres alfanuméricos y guiones bajos.`,
      );
    }
  }

  async createDefaultForEmpresa(empresaId: number, nombreEmpresa: string) {
    // Sanitize company name: remove all non-alphanumeric characters except underscores
    const sanitizedName = nombreEmpresa
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_') // Replace multiple consecutive underscores with single underscore
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores

    // PostgreSQL has a 63 character limit for identifiers
    // Reserve space for prefix and empresa ID (e.g., "empresa_123_" = ~13 chars)
    const maxNameLength = 50;
    const truncatedName = sanitizedName.slice(0, maxNameLength);

    const dbName = `empresa_${empresaId}_${truncatedName}`;

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

  async createDatabaseIfNotExists(dbName: string) {
    // Validate database name to prevent SQL injection
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
    } finally {
      await adminDs.destroy();
    }
  }

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
