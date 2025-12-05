import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { Alerta } from './entities/alerta.entity';
import { Sensor } from '../sensores/entities/sensor.entity';
import { TenantConnectionHelper } from 'src/infraestructura/base-datos/tenant-helpers';
import { BaseTenantService, PerfilLike } from 'src/infraestructura/base-datos/base-tenant.service';

@Injectable()
export class AlertasService extends BaseTenantService {
  private readonly logger = new Logger(AlertasService.name);

  constructor(tenant: TenantConnectionHelper) {
    super(tenant);
  }

  private getAlertaRepo(perfil: PerfilLike): Promise<Repository<Alerta>> {
    return this.getTenantRepo(perfil, Alerta);
  }

  private getSensorRepo(perfil: PerfilLike): Promise<Repository<Sensor>> {
    return this.getTenantRepo(perfil, Sensor);
  }

  private async validarSensor(perfil: PerfilLike, sensorId: number): Promise<void> {
    const repo = await this.getSensorRepo(perfil);

    const sensorExiste = await repo.findOne({
      where: { id: sensorId, borradoEn: IsNull() },
      select: ['id'],
    });

    if (!sensorExiste) throw new NotFoundException(`Sensor ${sensorId} no encontrado`);
  }

  /** Crear alerta desde la lógica automática */
  async createAutomaticAlert(
    perfil: PerfilLike,
    data: { mensaje: string; sensorId: number; estado?: boolean },
  ): Promise<Alerta> {
    await this.validarSensor(perfil, data.sensorId);

    const repo = await this.getAlertaRepo(perfil);

    const alerta = repo.create({
      mensaje: data.mensaje,
      sensorId: data.sensorId,
      estado: data.estado ?? true,
    });

    try {
      return await repo.save(alerta);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('No se pudo crear la alerta automática');
    }
  }

  async findAll(perfil: PerfilLike): Promise<Alerta[]> {
    const repo = await this.getAlertaRepo(perfil);

    return repo.find({
      where: { borradoEn: IsNull() },
      order: { creadoEn: 'DESC' },
      relations: ['sensor'],
    });
  }

  async findOne(perfil: PerfilLike, id: number): Promise<Alerta> {
    if (!Number.isInteger(id) || id <= 0)
      throw new BadRequestException('ID inválido');

    const repo = await this.getAlertaRepo(perfil);

    const alerta = await repo.findOne({
      where: { id, borradoEn: IsNull() },
      relations: ['sensor'],
    });

    if (!alerta) throw new NotFoundException(`Alerta ${id} no encontrada`);

    return alerta;
  }

  async update(perfil: PerfilLike, id: number, dto: UpdateAlertaDto) {
    const repo = await this.getAlertaRepo(perfil);

    const alerta = await this.findOne(perfil, id);

    alerta.estado = dto.estado ?? alerta.estado;

    try {
      return await repo.save(alerta);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error actualizando alerta');
    }
  }

  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getAlertaRepo(perfil);

    await this.findOne(perfil, id); // verifica existencia

    try {
      await repo.softDelete(id);
      return { message: `Alerta ${id} eliminada correctamente` };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error borrando alerta');
    }
  }
}
