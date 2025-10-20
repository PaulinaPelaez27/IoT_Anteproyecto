import { Injectable } from '@nestjs/common';
import { CreatePerfileDto } from './dto/create-perfile.dto';
import { UpdatePerfileDto } from './dto/update-perfile.dto';

@Injectable()
export class PerfilesService {
  create(createPerfileDto: CreatePerfileDto) {
    return 'This action adds a new perfile';
  }

  findAll() {
    return `This action returns all perfiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} perfile`;
  }

  update(id: number, updatePerfileDto: UpdatePerfileDto) {
    return `This action updates a #${id} perfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} perfile`;
  }
}
