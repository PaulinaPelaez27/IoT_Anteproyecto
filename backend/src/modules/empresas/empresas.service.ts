import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Empresa } from './entities/empresa.entity';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    try {
      const empresa = this.empresaRepository.create(createEmpresaDto as Partial<Empresa>);
      return this.empresaRepository.save(empresa);
    } catch (error) {
      // Manejo de errores, por ejemplo, lanzar una excepción personalizada
      throw new InternalServerErrorException('Error al crear la empresa');
    }
  }

  async findAll() {
    return this.empresaRepository.find({ where: { borrado: false } });
  }

  async findOne(id: number) {
    const empresa = await this.empresaRepository.findOne({ where: { id, borrado: false } });
    if (!empresa) throw new NotFoundException(`Empresa con id ${id} no encontrada`);
    return empresa;
  }

  async update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    const empresa = await this.empresaRepository.findOne({ where: { id, borrado: false } });
    if (!empresa) throw new NotFoundException(`Empresa con id ${id} no encontrada`);

    Object.assign(empresa, updateEmpresaDto);
    empresa.modificadoEn = new Date();
    return this.empresaRepository.save(empresa);
  }

  async remove(id: number) {
    const empresa = await this.empresaRepository.findOne({ where: { id, borrado: false } });
    if (!empresa) throw new NotFoundException(`Empresa con id ${id} no encontrada`);

    empresa.borrado = true;
    empresa.borradoEn = new Date();
    return this.empresaRepository.save(empresa);
  }
}
