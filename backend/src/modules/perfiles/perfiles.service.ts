import { Injectable } from '@nestjs/common';

@Injectable()
export class PerfilesService {
  create() {
    return 'This action adds a new perfile';
  }

  findAll() {
    return `This action returns all perfiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} perfile`;
  }

  update(id: number) {
    return `This action updates a #${id} perfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} perfile`;
  }
}
