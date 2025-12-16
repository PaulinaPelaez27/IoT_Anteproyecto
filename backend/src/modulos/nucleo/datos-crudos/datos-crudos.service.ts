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

  findOne(id: number) {
    return this.datosCrudosRepository.findOne({ where: { id } });
  }
}
