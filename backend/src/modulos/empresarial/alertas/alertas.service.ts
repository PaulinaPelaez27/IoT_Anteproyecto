import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
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

  private async validarSensor(perfil: PerfilLike, sensorId: number): Promise<Sensor> {
    const repo = await this.getSensorRepo(perfil);
    const sensor = await repo.findOne({ where: { id: sensorId, borrado: false } });
    if (!sensor) throw new NotFoundException(`Sensor ${sensorId} no encontrado`);
    return sensor;
  }

  /** Método interno: crear alerta desde la lógica automática (no expuesto en el controlador) */
  async createAutomaticAlert(
    perfil: PerfilLike,
    data: { mensaje: string; sensorId: number; estado?: boolean },
  ): Promise<Alerta> {
    const repo = await this.getAlertaRepo(perfil);
    const sensor = await this.validarSensor(perfil, data.sensorId);

    const alerta = repo.create({
      mensaje: data.mensaje,
      sensor,
      estado: data.estado ?? true,
      borrado: false,
    } as Partial<Alerta>);

    try {
      return await repo.save(alerta);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('No se pudo crear la alerta automática');
    }
  }

  async findAll(perfil: PerfilLike): Promise<Alerta[]> {
    const repo = await this.getAlertaRepo(perfil);
    return repo.find({ where: { borrado: false }, order: { creadoEn: 'DESC' }, relations: ['sensor'] });
  }

  async findOne(perfil: PerfilLike, id: number): Promise<Alerta> {
    if (!Number.isInteger(id) || id <= 0) throw new BadRequestException('ID inválido');

    const repo = await this.getAlertaRepo(perfil);
    const alerta = await repo.findOne({ where: { id, borrado: false }, relations: ['sensor'] });

    if (!alerta) throw new NotFoundException(`Alerta ${id} no encontrada`);
    return alerta;
  }

  async update(perfil: PerfilLike, id: number, dto: UpdateAlertaDto) {
    const repo = await this.getAlertaRepo(perfil);

    try {
      const alerta = await repo.preload({
        id,
        ...(dto.estado !== undefined && { estado: dto.estado }),
      });

      if (!alerta) throw new NotFoundException(`Alerta ${id} no encontrada`);

      await repo.save(alerta);
      return this.findOne(perfil, id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException('Error actualizando alerta');
    }
  }

  async remove(perfil: PerfilLike, id: number) {
    const repo = await this.getAlertaRepo(perfil);
    const alerta = await this.findOne(perfil, id);

    alerta.borrado = true;
    alerta.borradoEn = new Date();

    try {
      return repo.save(alerta);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error borrando alerta');
    }
  }
}
