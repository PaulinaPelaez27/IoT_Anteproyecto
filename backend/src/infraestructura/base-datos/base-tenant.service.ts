import {
  BadRequestException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import { TenantConnectionHelper } from './tenant-helpers';

export type PerfilLike = {
  p_id_empresa?: number;
  empresa?: { e_id?: number };
};

@Injectable()
export class BaseTenantService {
  constructor(
    private readonly tenantConnectionHelper: TenantConnectionHelper,
  ) {}

  async getTenantRepo<T extends ObjectLiteral>(
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
