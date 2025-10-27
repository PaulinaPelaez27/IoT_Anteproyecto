import { Injectable } from '@nestjs/common';
import { CreateRolesUsuarioDto } from './dto/create-roles-usuario.dto';
import { UpdateRolesUsuarioDto } from './dto/update-roles-usuario.dto';

@Injectable()
export class RolesUsuariosService {
  create(createRolesUsuarioDto: CreateRolesUsuarioDto) {
    return 'This action adds a new rolesUsuario';
  }

  findAll() {
    return `This action returns all rolesUsuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolesUsuario`;
  }

  update(id: number, updateRolesUsuarioDto: UpdateRolesUsuarioDto) {
    return `This action updates a #${id} rolesUsuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolesUsuario`;
  }
}
