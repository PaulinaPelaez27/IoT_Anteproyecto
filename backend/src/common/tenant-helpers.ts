import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConexionesService } from 'src/modules/conexiones/conexiones.service';

type TenantCfg = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  // Agrega aquí ssl, schema, etc. si los almacenas
};

@Injectable()
export class TenantConnectionHelper implements OnModuleDestroy {
  private readonly logger = new Logger(TenantConnectionHelper.name);

  // Caché de DataSources por empresaId
  private readonly cache = new Map<number, DataSource>();

  // Promesas en curso de inicialización por empresaId (para evitar dobles inicializaciones concurrentes)
  private readonly inFlight = new Map<number, Promise<DataSource>>();

  // Opciones comunes
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

  /** Recupera la configuración del tenant mediante el servicio (DI), no estática. */
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
      // Agrega aquí ssl, schema, etc. si los almacenas
    };

    return cfg;
  }

  /** Construye las opciones de TypeORM a partir de una configuración. */
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

  /** Crea un DataSource, lo inicializa y lo guarda en caché. */
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
   * Público: crea un DataSource directamente desde una configuración (omite la búsqueda).
   * Útil para scripts, tests, seeds, etc.
   */
  async createFromConfig(
    empresaId: number,
    cfg: TenantCfg,
    entities: any[] = [],
  ): Promise<DataSource> {
    // Si ya está en caché, lo cerramos primero para evitar sorpresas
    await this.close(empresaId);
    return this.createAndInit(empresaId, cfg, entities);
  }

  /** Cierra y elimina del caché un tenant. */
  async close(empresaId: number) {
    const ds = this.cache.get(empresaId);
    if (ds) {
      if (ds.isInitialized) await ds.destroy();
      this.cache.delete(empresaId);
      this.logger.log(`Closed tenant DataSource for empresaId=${empresaId}`);
    }
  }

  /** Cierra todos los tenants. Llamado al apagar el módulo. */
  async closeAll() {
    for (const [k, ds] of this.cache) {
      if (ds.isInitialized) await ds.destroy();
      this.cache.delete(k);
    }
    this.logger.log('Closed all tenant DataSources');
  }
}
