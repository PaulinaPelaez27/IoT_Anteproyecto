import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConexionesService } from 'src/modules/conexiones/conexiones.service';
import { Conexion } from 'src/modules/conexiones/entities/conexion.entity';

type TenantCfg = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  // ajoute ici ssl, schema, etc. si tu les stockes
};

/** Utilitaire pour convertir una entidad Conexion a TenantCfg */
function tenantCfgFromConexion(row: Conexion): TenantCfg {
  return {
    host: row.host,
    port: row.puerto ?? 5432,
    username: row.usuario,
    password: row.contrasena,
    database: row.nombreBaseDeDatos,
  };
}

@Injectable()
export class TenantConnectionHelper implements OnModuleDestroy {
  private readonly logger = new Logger(TenantConnectionHelper.name);

  // Cache des DataSources par empresaId
  private readonly cache = new Map<number, DataSource>();

  // Promesses en cours d'init par empresaId (pour éviter les doubles initialisations concurrentes)
  private readonly inFlight = new Map<number, Promise<DataSource>>();

  // Options communes
  private readonly baseOptions: Omit<
    DataSourceOptions,
    'host' | 'username' | 'password' | 'database'
  > = {
    type: 'postgres',
    synchronize: false,
    logging: false,
  };

  constructor(private readonly conexiones: ConexionesService) {}

  async onModuleDestroy() {
    await this.closeAll();
  }

  /** Récupère la config du tenant via le service (DI), pas de statique. */
  private async fetchTenantConfig(empresaId: number): Promise<TenantCfg> {
    if (!empresaId) throw new Error('empresaId requerido');

    const row = await this.conexiones.findByEmpresaId(empresaId);
    if (!row) {
      throw new NotFoundException(
        `No existe configuración de conexión para empresaId=${empresaId}`,
      );
    }

    const cfg: TenantCfg = {
      host: row.host,
      username: row.usuario,
      password: row.contrasena,
      database: row.nombreBaseDeDatos,
      // ajoute ici ssl, schema, etc. si tu les stockes
    };

    return cfg;
  }

  /** Construit les options TypeORM à partir d’une config. */
  private buildOptions(
    cfg: TenantCfg,
    entities: any[] = [],
  ): DataSourceOptions {
    const opts = {
      ...this.baseOptions,
      host: cfg.host,
      port: cfg.port ?? 5432,
      username: cfg.username,
      password: cfg.password,
      database: cfg.database,
      entities,
    } as DataSourceOptions;
    return opts;
  }

  /** Crée un DataSource, l'initialise et le met en cache. */
  private async createAndInit(
    empresaId: number,
    cfg: TenantCfg,
    entities: any[] = [],
  ): Promise<DataSource> {
    const options = this.buildOptions(cfg, entities);
    const ds = new DataSource(options);
    await ds.initialize();
    this.cache.set(empresaId, ds);
    this.logger.log(`Initialized tenant DataSource for empresaId=${empresaId}`);
    return ds;
  }

  /**
   * Public: récupère un DataSource pour un empresaId.
   * - utilise le cache
   * - charge la config depuis la DB “maîtresse”
   * - évite la double init concurrente
   */
  async getDataSource(
    empresaId: number,
    entities: any[] = [],
  ): Promise<DataSource> {
    if (!empresaId) throw new Error('empresaId requerido');

    // 1) cache
    const cached = this.cache.get(empresaId);
    if (cached) {
      if (!cached.isInitialized) await cached.initialize();
      return cached;
    }

    // 2) si une init est déjà en cours, on attend la même promesse
    const pending = this.inFlight.get(empresaId);
    if (pending) return pending;

    // 3) sinon, on lance l’init avec verrou
    const promise = (async () => {
      try {
        const cfg = await this.fetchTenantConfig(empresaId);
        return await this.createAndInit(empresaId, cfg, entities);
      } finally {
        this.inFlight.delete(empresaId);
      }
    })();

    this.inFlight.set(empresaId, promise);
    return promise;
  }

  /**
   * Public: crée un DataSource directement depuis une config (bypass fetch).
   * Utile pour des scripts, tests, seeds, etc.
   */
  async createFromConfig(
    empresaId: number,
    cfg: TenantCfg,
    entities: any[] = [],
  ): Promise<DataSource> {
    // si déjà en cache, on le ferme d'abord pour éviter des surprises
    await this.close(empresaId);
    return this.createAndInit(empresaId, cfg, entities);
  }

  /** Ferme et enlève du cache un tenant. */
  async close(empresaId: number) {
    const ds = this.cache.get(empresaId);
    if (ds) {
      if (ds.isInitialized) await ds.destroy();
      this.cache.delete(empresaId);
      this.logger.log(`Closed tenant DataSource for empresaId=${empresaId}`);
    }
  }

  /** Ferme tous les tenants. Appelé au shutdown module. */
  async closeAll() {
    for (const [k, ds] of this.cache) {
      if (ds.isInitialized) await ds.destroy();
      this.cache.delete(k);
    }
    this.logger.log('Closed all tenant DataSources');
  }
}
