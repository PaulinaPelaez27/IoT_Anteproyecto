import { DataSource } from 'typeorm';
import { TenantHelpers } from './tenant-helpers';

export class TenantConnectionService {
  async getDataSourceForEmpresaId(
    empresaId: number,
  ): Promise<DataSource | null> {
    if (!empresaId) throw new Error('empresaId requerido');
    if (empresaId <= 0) throw new Error('empresaId inválido');

    // add check : id -> token usuario autorizado para esa empresa

    return await TenantHelpers.getDataSourceForEmpresaId(empresaId);
  }
}
