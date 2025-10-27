import { DataSource, DataSourceOptions } from 'typeorm';
import { Conexion } from '../modules/conexiones/entities/conexion.entity';

const cache = new Map<number, DataSource>();

const baseOptions: Partial<DataSourceOptions> = {
  type: 'postgres',
  port: 5432,
  synchronize: false,
  logging: false,
  // entities will be set per-tenant when needed
};

type TenantConfig = {
  host: string;
  port?: number;
  username: string;
  password: string;
  database: string;
};

/**
 * fetchTenantConfig obtiene la configuración de conexión desde la tabla tb_conexiones
 * usando la conexión por defecto (la ya configurada en TypeOrmModule.forRoot).
 * Recibe la empresaId y devuelve host/puerto/usuario/password/database.
 */
export async function fetchTenantConfig(empresaId: number): Promise<TenantConfig | null> {
  // Creamos un DataSource temporal apuntando a la conexión por defecto (usada por la app)
  // para leer la tabla tb_conexiones. Asumimos que la entidad Conexion está registrada
  // en la DataSource global (la provista por TypeOrmModule.forRoot).
  // Para evitar crear otro DataSource, intentaremos usar getRepository a través de
  // require de TypeORM; sin embargo, en TypeORM v0.3 no existe un getRepository global
  // sin una instancia. En lugar de eso, asumimos que la tabla tb_conexiones
  // está accesible por el DataSource por defecto llamado 'default'.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const typeorm = require('typeorm');
    const defaultDataSource: DataSource | undefined = typeorm.getDataSource?.('default') || typeorm.AppDataSource || undefined;
    if (!defaultDataSource || !defaultDataSource.isInitialized) {
      // nothing we can do here without the initialized default DataSource
      return null;
    }

    const repo = defaultDataSource.getRepository(Conexion);
    const conn = await repo.findOne({ where: { empresaId, estado: true, borrado: false } as any });
    if (!conn) return null;

    return {
      host: conn.host || 'localhost',
      port: conn.puerto || 5432,
      username: conn.usuario,
      password: conn.contrasena,
      database: conn.nombreBaseDeDatos,
    };
  } catch (err) {
    // si falla, devolvemos null
    return null;
  }
}

export async function getDataSourceForEmpresa(empresaId: number, entities: Function[] = []): Promise<DataSource | null> {
  if (!empresaId) throw new Error('empresaId requerido');

  const cached = cache.get(empresaId);
  if (cached) {
    if (!cached.isInitialized) await cached.initialize();
    return cached;
  }

  const cfg = await fetchTenantConfig(empresaId);
  if (!cfg) return null;

  // TypeORM DataSourceOptions is a discriminated union; assert as any for Postgres
  const options = {
    ...(baseOptions as any),
    type: 'postgres',
    host: cfg.host,
    port: cfg.port ?? 5432,
    username: cfg.username,
    password: cfg.password,
    database: cfg.database,
    entities,
  } as DataSourceOptions;

  const ds = new DataSource(options);
  await ds.initialize();
  cache.set(empresaId, ds);
  console.log(`Initialized tenant DataSource for empresaId=${empresaId}`);
  return ds;
}

/**
 * Crea un DataSource a partir de una configuración explícita y lo cachea por empresaId.
 */
export async function createDataSourceFromConfig(
  empresaId: number,
  cfg: TenantConfig,
  entities: Function[] = [],
): Promise<DataSource> {
  const options = {
    ...(baseOptions as any),
    type: 'postgres',
    host: cfg.host,
    port: cfg.port ?? 5432,
    username: cfg.username,
    password: cfg.password,
    database: cfg.database,
    entities,
  } as DataSourceOptions;

  const ds = new DataSource(options);
  await ds.initialize();
  cache.set(empresaId, ds);
  console.log(`Initialized tenant DataSource for empresaId=${empresaId}`);
  return ds;
}

/**
 * Obtiene un DataSource directo a partir de un objeto Conexion (registro de tb_conexiones).
 * Si ya existe un DataSource cacheado para la empresa, lo retorna.
 */
export async function getDataSourceFromConexion(conn: Conexion, entities: Function[] = []): Promise<DataSource | null> {
  const empresaId = (conn as any).empresaId ?? (conn as any).id;
  if (!empresaId) return null;

  const cached = cache.get(empresaId);
  if (cached) {
    if (!cached.isInitialized) await cached.initialize();
    return cached;
  }

  const cfg: TenantConfig = {
    host: (conn as any).host ?? 'localhost',
    port: (conn as any).puerto ?? 5432,
    username: (conn as any).usuario,
    password: (conn as any).contrasena,
    database: (conn as any).nombreBaseDeDatos,
  };

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
