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
  ) {}

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

  async createDatabaseIfNotExists(dbName: string) {
    const adminDs = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'postgres',
    });

    await adminDs.initialize();
    const exists = await adminDs.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (exists.length === 0) {
      await adminDs.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Base de datos ${dbName} creada`);
    }
    await adminDs.destroy();
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
