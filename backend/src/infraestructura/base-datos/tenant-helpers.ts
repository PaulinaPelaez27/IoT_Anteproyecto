import {
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConexionesService } from '../../modulos/nucleo/conexiones/conexiones.service';

import { Proyecto } from '../../modulos/empresarial/proyectos/entities/proyecto.entity';
import { Nodo } from '../../modulos/empresarial/nodos/entities/nodo.entity';
import { Sensor } from '../../modulos/empresarial/sensores/entities/sensor.entity';
import { VariablesSoportaSensor } from '../../modulos/empresarial/variables-soporta-sensores/entities/variables-soporta-sensor.entity';
import { Variable } from '../../modulos/empresarial/variables/entities/variable.entity';
import { LecturasSensor } from '../../modulos/empresarial/lecturas-sensores/entities/lecturas-sensor.entity';
import { Umbral } from '../../modulos/empresarial/umbrales/entities/umbral.entity';
import { Alerta } from '../../modulos/empresarial/alertas/entities/alerta.entity';

//** Lista completa de ENTIDADES obligatorias del dominio IoT
const ENTIDADES_IOT = [
  Proyecto,
  Nodo,
  Sensor,
  VariablesSoportaSensor,
  Variable,
  LecturasSensor,
  Umbral,
  Alerta,
];

type TenantCfg = {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
};

@Injectable()
export class TenantConnectionHelper implements OnModuleDestroy {
  private readonly logger = new Logger(TenantConnectionHelper.name);

  private readonly cache = new Map<number, DataSource>();
  private readonly inFlight = new Map<number, Promise<DataSource>>();

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

  /** Obtiene la configuración de la conexión para la empresa */
  private async fetchTenantConfig(empresaId: number): Promise<TenantCfg> {
    if (!empresaId) throw new Error('empresaId requerido');

    const row = await this.conexiones.findByEmpresaId(empresaId);
    this.logger.debug(
      `Configuración obtenida para empresaId=${empresaId}`,
      row,
    );

    if (!row) {
      throw new NotFoundException(
        `No existe configuración de conexión para empresaId=${empresaId}`,
      );
    }

    return {
      host: row.host,
      port: row.puerto,
      username: row.usuario,
      password: row.contrasena,
      database: row.nombreBaseDeDatos,
    };
  }

  /** Crea DataSourceOptions SOLO con ENTIDADES_IOT */
  private buildOptions(cfg: TenantCfg): DataSourceOptions {
    return {
      ...this.baseOptions,
      host: cfg.host,
      port: cfg.port ?? 5432,
      username: cfg.username,
      password: cfg.password,
      database: cfg.database,
      entities: ENTIDADES_IOT,
    } as DataSourceOptions;
  }

  /** Crea y cachea un DataSource con TODAS las ENTIDADES */
  private async createAndInit(
    empresaId: number,
    cfg: TenantCfg,
  ): Promise<DataSource> {
    const options = this.buildOptions(cfg);
    const ds = new DataSource(options);

    this.logger.log(
      `🟡 Inicializando DataSource para empresa ${empresaId}...`,
    );

    await ds.initialize();

    this.logger.log(
      `🟢 Conexión inicializada correctamente para empresa ${empresaId}`,
    );

    this.cache.set(empresaId, ds);
    return ds;
  }

  /** Obtiene (o crea) una conexión del Tenant */
  async getDataSource(empresaId: number): Promise<DataSource> {
    this.logger.log('getDataSource llamado con empresaId: ' + empresaId);
    if (!empresaId) throw new Error('empresaId requerido');

    // 1) Ya existe en caché → usarlo
    const cached = this.cache.get(empresaId);
    if (cached) {
      if (!cached.isInitialized) await cached.initialize();
      return cached;
    }

    // 2) Ya se está creando → esperar
    const pending = this.inFlight.get(empresaId);
    if (pending) return pending;

    // 3) Crear la conexión
    const promise = (async () => {
      try {
        const cfg = await this.fetchTenantConfig(empresaId);
        return await this.createAndInit(empresaId, cfg);
      } finally {
        this.inFlight.delete(empresaId);
      }
    })();

    this.inFlight.set(empresaId, promise);
    return promise;
  }

  /** Crea una conexión desde una config directa (usada para scripts/tests) */
  async createFromConfig(
    empresaId: number,
    cfg: TenantCfg,
  ): Promise<DataSource> {
    await this.close(empresaId);
    return this.createAndInit(empresaId, cfg);
  }

  /** Cierra 1 tenant */
  async close(empresaId: number) {
    const ds = this.cache.get(empresaId);
    if (ds) {
      if (ds.isInitialized) await ds.destroy();
      this.cache.delete(empresaId);
      this.logger.log(`Closed tenant DataSource for empresaId=${empresaId}`);
    }
  }

  /** Cierra todos los tenants */
  async closeAll() {
    for (const [k, ds] of this.cache) {
      if (ds.isInitialized) await ds.destroy();
      this.cache.delete(k);
    }
    this.logger.log('Closed all tenant DataSources');
  }
}