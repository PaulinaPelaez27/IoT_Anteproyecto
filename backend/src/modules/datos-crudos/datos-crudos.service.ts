import { Injectable } from '@nestjs/common';

@Injectable()
export class DatosCrudosService {
  create() {
    return 'This action adds a new datosCrudo';
  }

  findAll() {
    return `This action returns all datosCrudos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} datosCrudo`;
  }

  update(id: number) {
    return `This action updates a #${id} datosCrudo`;
  }

  remove(id: number) {
    return `This action removes a #${id} datosCrudo`;
  }
}
