import { DataSource } from 'typeorm';
import * as typeorm from 'typeorm';
import { Conexion } from '../modules/conexiones/entities/conexion.entity';

const cache = new Map<number, DataSource>();

const baseOptions = {
  type: 'postgres' as const,
  port: 5432,
  synchronize: false,
  logging: false,
};

async function fetchTenantConfig(empresaId: number) {
  try {
    // try to access the application's default DataSource
    const defaultDataSource =
      (typeorm as any).getDataSource?.('default') ||
      (typeorm as any).AppDataSource ||
      undefined;
    if (!defaultDataSource || !defaultDataSource.isInitialized) {
      return null;
    }
    const repo = defaultDataSource.getRepository(Conexion);
    const conn = await repo.findOne({
      where: { empresaId, estado: true, borrado: false },
    } as any);
    if (!conn) return null;
    return {
      host: conn.host || 'localhost',
      port: conn.puerto || 5432,
      username: conn.usuario,
      password: conn.contrasena,
      database: conn.nombreBaseDeDatos,
    };
  } catch (err) {
    return null;
  }
}

export async function getDataSourceForEmpresa(
  empresaId: number,
  entities: any[] = [],
): Promise<DataSource | null> {
  if (!empresaId) throw new Error('empresaId requerido');
  const cached = cache.get(empresaId);
  if (cached) {
    if (!cached.isInitialized) await cached.initialize();
    return cached;
  }
  const cfg = await fetchTenantConfig(empresaId);
  if (!cfg) return null;
  const options = {
    ...baseOptions,
    type: 'postgres',
    host: cfg.host,
    port: cfg.port ?? 5432,
    username: cfg.username,
    password: cfg.password,
    database: cfg.database,
    entities,
  } as any;
  const ds = new DataSource(options);
  await ds.initialize();
  cache.set(empresaId, ds);
  console.log(`Initialized tenant DataSource for empresaId=${empresaId}`);
  return ds;
}

export async function createDataSourceFromConfig(
  empresaId: number,
  cfg: {
    host: string;
    port?: number;
    username: string;
    password: string;
    database: string;
  },
  entities: any[] = [],
): Promise<DataSource> {
  const options = {
    ...baseOptions,
    type: 'postgres',
    host: cfg.host,
    port: cfg.port ?? 5432,
    username: cfg.username,
    password: cfg.password,
    database: cfg.database,
    entities,
  } as any;
  const ds = new DataSource(options);
  await ds.initialize();
  cache.set(empresaId, ds);
  console.log(`Initialized tenant DataSource for empresaId=${empresaId}`);
  return ds;
}

export async function getDataSourceForEmpresaId(
  empresaId: number,
): Promise<DataSource | null> {
  if (!empresaId) throw new Error('empresaId requerido');
  const cached = cache.get(empresaId);
  if (cached) {
    if (!cached.isInitialized) await cached.initialize();
    return cached;
  }
  const cfg = await fetchTenantConfig(empresaId);
  if (!cfg) return null;
  const options = {
    ...baseOptions,
    type: 'postgres',
    host: cfg.host,
    port: cfg.port ?? 5432,
    username: cfg.username,
    password: cfg.password,
    database: cfg.database,
  } as any;
  const ds = new DataSource(options);
  await ds.initialize();
  cache.set(empresaId, ds);
  console.log(`Initialized tenant DataSource for empresaId=${empresaId}`);
  return ds;
}

export async function getDataSourceFromConexion(
  conn: any,
  entities: any[] = [],
) {
  const empresaId = conn.empresaId ?? conn.id;
  console.log('getDataSourceFromConexion called with empresaId:', empresaId);
  if (!empresaId) return null;
  const cached = cache.get(empresaId);
  if (cached) {
    if (!cached.isInitialized) await cached.initialize();
    return cached;
  }
  const cfg = {
    host: conn.host ?? 'localhost',
    port: conn.puerto ?? 5432,
    username: conn.usuario,
    password: conn.contrasena,
    database: conn.nombreBaseDeDatos,
  } as any;
  return createDataSourceFromConfig(empresaId, cfg, entities);
}

export async function closeTenant(empresaId: number) {
  const ds = cache.get(empresaId);
  if (ds) {
    if (ds.isInitialized) await ds.destroy();
    cache.delete(empresaId);
  }
}

export async function closeAllTenants() {
  for (const [k, ds] of cache) {
    if (ds.isInitialized) await ds.destroy();
    cache.delete(k);
  }
}

export class TenantHelpers {
  static getDataSourceForEmpresaId = getDataSourceForEmpresaId;
  static getDataSourceForEmpresa = getDataSourceForEmpresa;
  static getDataSourceFromConexion = getDataSourceFromConexion;
  static createDataSourceFromConfig = createDataSourceFromConfig;
  static closeTenant = closeTenant;
  static closeAllTenants = closeAllTenants;
}
