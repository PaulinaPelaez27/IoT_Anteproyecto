import { Injectable } from '@nestjs/common';
import { CreateConexioneDto } from './dto/create-conexione.dto';
import { UpdateConexioneDto } from './dto/update-conexione.dto';

@Injectable()
export class ConexionesService {
  create(createConexioneDto: CreateConexioneDto) {
    return 'This action adds a new conexione';
  }

  findAll() {
    return `This action returns all conexiones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conexione`;
  }

  update(id: number, updateConexioneDto: UpdateConexioneDto) {
    return `This action updates a #${id} conexione`;
  }

  remove(id: number) {
    return `This action removes a #${id} conexione`;
  }
}
