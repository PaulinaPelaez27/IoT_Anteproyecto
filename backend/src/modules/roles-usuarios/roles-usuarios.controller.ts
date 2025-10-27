import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesUsuariosService } from './roles-usuarios.service';
import { CreateRolesUsuarioDto } from './dto/create-roles-usuario.dto';
import { UpdateRolesUsuarioDto } from './dto/update-roles-usuario.dto';

@Controller('roles-usuarios')
export class RolesUsuariosController {
  constructor(private readonly rolesUsuariosService: RolesUsuariosService) {}

  @Post()
  create(@Body() createRolesUsuarioDto: CreateRolesUsuarioDto) {
    return this.rolesUsuariosService.create(createRolesUsuarioDto);
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
  update(@Param('id') id: string, @Body() updateRolesUsuarioDto: UpdateRolesUsuarioDto) {
    return this.rolesUsuariosService.update(+id, updateRolesUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesUsuariosService.remove(+id);
  }
}
