import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import { TenantConnectionHelper } from './tenant-helpers';

export type PerfilLike = {
  p_id_empresa?: number;
  empresa?: { e_id?: number };
};

export abstract class BaseTenantService {
  constructor(
    protected readonly tenantConnectionHelper: TenantConnectionHelper,
  ) {}

  protected async getTenantRepo<T extends ObjectLiteral>(
    perfil: PerfilLike,
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    const empresaId = perfil.p_id_empresa ?? perfil.empresa?.e_id;

    if (!empresaId) {
      throw new BadRequestException('empresaId requerido');
    }

    const ds = await this.tenantConnectionHelper.getDataSource(empresaId);

    if (!ds) {
      throw new InternalServerErrorException(
        `No se pudo obtener la conexión para la empresa ${empresaId}`,
      );
    }

    return ds.getRepository(entity);
  }
}
