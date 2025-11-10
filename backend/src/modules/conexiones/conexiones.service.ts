import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConexioneDto } from './dto/create-conexione.dto';
import { UpdateConexioneDto } from './dto/update-conexione.dto';
import { Conexion } from './entities/conexion.entity';
import { DataSource } from 'typeorm';

/*
@Injectable()
// Servicio que maneja las operaciones CRUD y helpers para la entidad Conexion.
export class ConexionesService {
  // Inyecta el repositorio TypeORM para la entidad Conexion
  constructor(
    @InjectRepository(Conexion)
    private readonly conexionRepo: Repository<Conexion>,
  ) {}

  // Crea una nueva entidad Conexion a partir del DTO y la guarda en la BD.
  async create(createConexioneDto: CreateConexioneDto) {
    const ent = this.conexionRepo.create(
      createConexioneDto as Partial<Conexion>,
    );
    return this.conexionRepo.save(ent);
  }

  // Devuelve todas las conexiones que no están marcadas como borradas.
  async findAll() {
    return this.conexionRepo.find({ where: { borrado: false } });
  }

  // Busca una conexión por su id. Lanza NotFoundException si no existe.
  async findOne(id: number) {
    const e = await this.conexionRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Conexione not found');
    return e;
  }

  // Actualiza una entidad existente aplicando los cambios del DTO y guardándola.
  async update(id: number, updateConexioneDto: UpdateConexioneDto) {
    const ent = await this.findOne(id);
    Object.assign(ent, updateConexioneDto);
    return this.conexionRepo.save(ent);
  }

  // Marca una conexión como borrada (soft delete) y registra la fecha de borrado.
  async remove(id: number) {
    const ent = await this.findOne(id);
    ent.borrado = true;
    ent.borradoEn = new Date();
    return this.conexionRepo.save(ent);
  }

  /**
   * Recupera la conexión (fila) en `tb_conexiones` para una empresa determinada.
   * Uso previsto: proporcionar las credenciales/información de conexión para crear/obtener
   * un DataSource hacia la BD tenant.
   */

/*
  async findByEmpresaId(empresaId: number): Promise<Conexion | null> {
    if (!empresaId) throw new Error('empresaId requerido');
    return this.conexionRepo.findOne({
      where: { empresaId, borrado: false },
    });
  }

  /**
   * Ejemplo de ayuda: recupera la fila de conexión E intenta obtener
   * el DataSource tenant mediante TenantConnectionService (si está implementado).
   * Retorna un objeto { conexion, dataSource }.
   */
/*
  async getTenantDataSourceForEmpresaId(empresaId: number): Promise<Conexion> {
    const conexion = await this.findByEmpresaId(empresaId);
    if (!conexion)
      throw new NotFoundException('Conexion para empresa no encontrada');

    return conexion;
  }
}
*/

//Desde aqui nuevo codigo

@Injectable()
export class ConexionesService {
  constructor(
    @InjectRepository(Conexion)
    private readonly conexionRepo: Repository<Conexion>,
  ) {}

  async create(createConexioneDto: CreateConexioneDto) {
    const ent = this.conexionRepo.create(createConexioneDto);
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

  async update(id: number, dto: UpdateConexioneDto) {
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

  async createDefaultForEmpresa(empresaId: number, nombreEmpresa: string) {
    const dbName = `empresa_${empresaId}_${nombreEmpresa
      .toLowerCase()
      .replace(/\s+/g, '_')}`;

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

  /**
   * Validates that a database name contains only alphanumeric characters and underscores.
   * This prevents SQL injection attacks in CREATE DATABASE statements.
   */
  private validateDatabaseName(dbName: string): void {
    if (!dbName || typeof dbName !== 'string') {
      throw new Error('Database name must be a non-empty string');
    }

    // Allow only alphanumeric characters and underscores
    const validPattern = /^[a-zA-Z0-9_]+$/;
    if (!validPattern.test(dbName)) {
      throw new Error(
        'Database name can only contain alphanumeric characters and underscores',
      );
    }

    // Additional check: database name should not be too long (PostgreSQL limit is 63 chars)
    if (dbName.length > 63) {
      throw new Error('Database name exceeds maximum length of 63 characters');
    }
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
        console.log(`✅ Base de datos ${dbName} creada`);
      }
    } finally {
      await adminDs.destroy();
    }
  }

  async testConnection(conexion: Conexion) {
    const ds = new DataSource({
      type: 'postgres',
      host: conexion.host,
      port: conexion.puerto,
      username: conexion.usuario,
      password: conexion.contrasena,
      database: conexion.nombreBaseDeDatos,
    });

    try {
      await ds.initialize();
      await ds.query('SELECT 1');
      await ds.destroy();
      return { ok: true, message: 'Conexión válida ✅' };
    } catch (error) {
      return { ok: false, message: error.message };
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
