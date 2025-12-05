import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { RolesUsuariosService } from './roles-usuarios.service';
import { CreateRolUsuarioDto } from './dto/create-roles-usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-roles-usuario.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('roles-usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class RolesUsuariosController {
  constructor(private readonly rolesUsuariosService: RolesUsuariosService) {}

  @Post()
  create(@Body() dto: CreateRolUsuarioDto) {
    return this.rolesUsuariosService.create(dto);
  }

  @Get()
  findAll() {
    return this.rolesUsuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesUsuariosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRolUsuarioDto,
  ) {
    return this.rolesUsuariosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesUsuariosService.remove(id);
  }
}