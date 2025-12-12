import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatoCrudo } from './entities/dato-crudo.entity';

@Injectable()
export class DatosCrudosService {
  constructor(
    @InjectRepository(DatoCrudo)
    private datosCrudosRepository: Repository<DatoCrudo>,
  ) {}

  create(data: Partial<DatoCrudo>) {
    return this.datosCrudosRepository.create(data);
  }

  findAll() {
    return this.datosCrudosRepository.find();
  }

  findOne(id: number) {
    return this.datosCrudosRepository.findOne({ where: { id } });
  }

  update(id: number, data: Partial<DatoCrudo>) {
    return this.datosCrudosRepository.update(id, data);
  }

  remove(id: number) {
    return this.datosCrudosRepository.softDelete(id);
  }
}
