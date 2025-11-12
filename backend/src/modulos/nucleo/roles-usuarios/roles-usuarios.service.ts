import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesUsuariosService {
  create() {
    return 'This action adds a new rolesUsuario';
  }

  findAll() {
    return `This action returns all rolesUsuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolesUsuario`;
  }

  update(id: number) {
    return `This action updates a #${id} rolesUsuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolesUsuario`;
  }
}
