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

  async closeTenant(empresaId: number) {
    return tenantHelpers.closeTenant(empresaId);
  }

  async closeAllTenants() {
    return tenantHelpers.closeAllTenants();
  }
}

export default TenantConnectionService;
