import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Empresa } from './entities/empresa.entity';
import { ConexionesService } from '../conexiones/conexiones.service';

@Injectable()
export class EmpresasService {
  private readonly logger = new Logger(EmpresasService.name);

  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepo: Repository<Empresa>,

    private readonly conexionesService: ConexionesService,
  ) {}

  // ==================================================
  // CREATE
  // ==================================================
  async create(dto: CreateEmpresaDto): Promise<Empresa> {
    try {
      const empresa = this.empresaRepo.create(dto);
      const saved = await this.empresaRepo.save(empresa);

      // Crear base operativa y conexión para empresa
      try {
        await this.conexionesService.createDefaultForEmpresa(saved.id, saved.nombre);
        this.logger.log(`Conexión creada para empresa ID=${saved.id}`);
      } catch (err) {
        this.logger.error(`Error creando conexión para empresa ID=${saved.id}: ${err.message}`);
      }

      
      return saved;
    } catch (err) {
      throw new InternalServerErrorException('Error al crear empresa');
    }
  }

  // ==================================================
  // FIND ALL
  // ==================================================
  async findAll(): Promise<Empresa[]> {
    return this.empresaRepo.find({
      where: { borradoEn: IsNull() },
      order: { id: 'ASC' },
    });
  }

  // ==================================================
  // FIND ONE
  // ==================================================
  async findOne(id: number): Promise<Empresa> {
    if (!id || id <= 0) throw new BadRequestException('ID inválido');

    const empresa = await this.empresaRepo.findOne({
      where: { id, borradoEn: IsNull() },
    });

    if (!empresa)
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);

    return empresa;
  }

  // ==================================================
  // UPDATE
  // ==================================================
  async update(id: number, dto: UpdateEmpresaDto): Promise<Empresa> {
    const empresa = await this.findOne(id);

    Object.assign(empresa, dto);

    try {
      return await this.empresaRepo.save(empresa);
    } catch (err) {
      throw new InternalServerErrorException('Error actualizando empresa');
    }
  }

  // ==================================================
  // SOFT DELETE
  // ==================================================
  async remove(id: number) {
    const empresa = await this.findOne(id);

    empresa.borradoEn = new Date();

    try {
      return await this.empresaRepo.save(empresa);
    } catch (err) {
      throw new InternalServerErrorException('Error eliminando empresa');
    }
  }
}
