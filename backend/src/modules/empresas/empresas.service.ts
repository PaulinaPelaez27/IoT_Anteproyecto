import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Empresa } from './entities/empresa.entity';
import { ConexionesService } from '../conexiones/conexiones.service';

@Injectable()
export class EmpresasService {
  private readonly logger = new Logger(EmpresasService.name);

  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly conexionesService: ConexionesService, // Importante: integrar servicio de conexiones
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    try {
      //  Crear empresa
      const empresa = this.empresaRepository.create(createEmpresaDto);
      const savedEmpresa = await this.empresaRepository.save(empresa);

      //  Crear conexión automática (y base operativa)
      try {
        await this.conexionesService.createDefaultForEmpresa(
          savedEmpresa.id,
          savedEmpresa.nombre,
        );
        this.logger.log(
          ` Conexión creada para empresa ${savedEmpresa.nombre} (ID=${savedEmpresa.id})`,
        );
      } catch (err) {
        this.logger.error(
          ` No se pudo crear la conexión para empresa ${savedEmpresa.nombre}: ${err.message}`,
        );
      }

      return savedEmpresa;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al crear la empresa: ' + error.message,
      );
    }
  }

  async findAll() {
    return this.empresaRepository.find({ where: { borrado: false } });
  }

  async findOne(id: number) {
    const empresa = await this.empresaRepository.findOne({
      where: { id, borrado: false },
    });
    if (!empresa)
      throw new NotFoundException(`Empresa con id ${id} no encontrada`);
    return empresa;
  }

  async update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    const empresa = await this.findOne(id);
    Object.assign(empresa, updateEmpresaDto);
    empresa.modificadoEn = new Date();
    return this.empresaRepository.save(empresa);
  }

  async remove(id: number) {
    const empresa = await this.findOne(id);
    empresa.borrado = true;
    empresa.borradoEn = new Date();
    return this.empresaRepository.save(empresa);
  }
}
