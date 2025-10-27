import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as tenantHelpers from './tenant-datasource';

@Injectable()
export class TenantConnectionService {
  /**
   * Devuelve (y crea si hace falta) un DataSource para la empresa indicada.
   * entities: array de entidades a registrar en el DataSource tenant.
   */
  async getDataSourceForEmpresa(empresaId: number, entities: Function[] = []): Promise<DataSource | null> {
    return tenantHelpers.getDataSourceForEmpresa(empresaId, entities);
  }

  async getDataSourceFromConexion(conn: any, entities: Function[] = []): Promise<DataSource | null> {
    return tenantHelpers.getDataSourceFromConexion(conn, entities);
  }

  /**
   * Devuelve un repositorio tipado para la entidad y perfil/empresa proporcionados.
   * perfil puede ser un objeto con p_id_empresa o un objeto Conexion.
   */
  async getTenantRepository(perfilOrConn: any, entity: Function) {
    // Si nos pasan un objeto Conexion, usamos getDataSourceFromConexion
    let ds = null as DataSource | null;
    if (perfilOrConn && perfilOrConn.nombreBaseDeDatos) {
      ds = await this.getDataSourceFromConexion(perfilOrConn, [entity]);
    } else {
      const empresaId = perfilOrConn?.p_id_empresa ?? perfilOrConn?.empresa?.e_id ?? perfilOrConn?.empresaId;
      if (!empresaId) throw new Error('empresaId requerido');
      ds = await this.getDataSourceForEmpresa(empresaId, [entity]);
    }

    if (!ds) throw new Error('No tenant datasource available');
    return ds.getRepository(entity as any);
  }

  async closeTenant(empresaId: number) {
    return tenantHelpers.closeTenant(empresaId);
  }

  async closeAllTenants() {
    return tenantHelpers.closeAllTenants();
  }
}

export default TenantConnectionService;
