import { Injectable } from '@nestjs/common';
import { CreateDatosCrudoDto } from './dto/create-datos-crudo.dto';
import { UpdateDatosCrudoDto } from './dto/update-datos-crudo.dto';

@Injectable()
export class DatosCrudosService {
  create(createDatosCrudoDto: CreateDatosCrudoDto) {
    return 'This action adds a new datosCrudo';
  }

  findAll() {
    return `This action returns all datosCrudos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} datosCrudo`;
  }

  update(id: number, updateDatosCrudoDto: UpdateDatosCrudoDto) {
    return `This action updates a #${id} datosCrudo`;
  }

  remove(id: number) {
    return `This action removes a #${id} datosCrudo`;
  }
}
