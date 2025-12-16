import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { AlertaUsuario } from './entities/alertas-usuario.entity';
import { UpdateAlertasUsuarioDto } from './dto/update-alertas-usuario.dto';
import {
  BaseTenantService,
  PerfilLike,
} from '../../../infraestructura/base-datos/base-tenant.service';

type FindOptions = { soloNoLeidas?: boolean; alertaId?: number };

@Injectable()
export class AlertasUsuariosService {
  private readonly logger = new Logger(AlertasUsuariosService.name);

  constructor(private readonly baseTenantService: BaseTenantService) {}

  private async getRepo(
    perfil: PerfilLike,
  ): Promise<Repository<AlertaUsuario>> {
    return this.baseTenantService.getTenantRepo<AlertaUsuario>(
      perfil,
      AlertaUsuario,
    );
  }

  async findAll(perfil: PerfilLike, usuarioId: number, opts: FindOptions = {}) {
    if (!usuarioId) throw new BadRequestException('usuarioId requerido');

    const repo = await this.getRepo(perfil);

    const qb = repo
      .createQueryBuilder('au')
      .leftJoinAndSelect('au.alerta', 'alerta');
    qb.where('au.borrado = false').andWhere('au.usuarioId = :usuarioId', {
      usuarioId,
    });

    if (opts.soloNoLeidas) qb.andWhere('au.leido = false');
    if (opts.alertaId)
      qb.andWhere('alerta.id = :alertaId', { alertaId: opts.alertaId });

    qb.orderBy('au.creadoEn', 'DESC');

    this.logger.debug(`Buscando alertasUsuario usuarioId=${usuarioId}`);
    return qb.getMany();
  }

  async findOne(perfil: PerfilLike, id: number, usuarioId?: number) {
    const repo = await this.getRepo(perfil);

    const where: any = { id, borrado: false };
    if (usuarioId) where.usuarioId = usuarioId;

    const entity = await repo.findOne({ where, relations: ['alerta'] });
    if (!entity) throw new NotFoundException('Alerta-usuario no encontrada');
    return entity;
  }

  async update(
    perfil: PerfilLike,
    id: number,
    usuarioId: number,
    dto: UpdateAlertasUsuarioDto,
  ) {
    if (!usuarioId) throw new BadRequestException('usuarioId requerido');

    const repo = await this.getRepo(perfil);
    const entity = await repo.findOne({
      where: { id, borrado: false, usuarioId },
    });
    if (!entity) throw new NotFoundException('Alerta-usuario no encontrada');

    const now = new Date();

    if (dto.leido !== undefined) {
      if (dto.leido !== entity.leido) {
        if (dto.leido) {
          entity.leidoEn = now;
        } else {
          entity.leidoEn = undefined;
        }
      }
      entity.leido = dto.leido;
    }

    if (dto.estado !== undefined) entity.estado = dto.estado;

    await repo.save(entity);
    this.logger.log(
      `Alerta-usuario ${id} actualizada por usuario ${usuarioId}`,
    );
    return entity;
  }

  async softDelete(perfil: PerfilLike, id: number, usuarioId: number) {
    if (!usuarioId) throw new BadRequestException('usuarioId requerido');

    const repo = await this.getRepo(perfil);
    const entity = await repo.findOne({
      where: { id, borrado: false, usuarioId },
    });
    if (!entity) throw new NotFoundException('Alerta-usuario no encontrada');

    //entity.borrado = true;

    await repo.softDelete({ id, usuarioId });
    this.logger.log(
      `Alerta-usuario ${id} borrado lógicamente por usuario ${usuarioId}`,
    );
    return { ok: true };
  }
}
