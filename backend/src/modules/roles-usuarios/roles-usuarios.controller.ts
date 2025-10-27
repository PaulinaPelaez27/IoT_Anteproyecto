import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { RolesUsuariosService } from './roles-usuarios.service';

@Controller('roles-usuarios')
export class RolesUsuariosController {
  constructor(private readonly rolesUsuariosService: RolesUsuariosService) {}

  @Post()
  create() {
    return this.rolesUsuariosService.create();
  }

  @Get()
  findAll() {
    return this.rolesUsuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesUsuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.rolesUsuariosService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesUsuariosService.remove(+id);
  }
}
