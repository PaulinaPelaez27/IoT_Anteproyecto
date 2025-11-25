import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // ===============================
  // CREAR USUARIO — SOLO ADMIN_GLOBAL
  // ===============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_GLOBAL')
  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  // ===============================
  // LISTAR USUARIOS DE UNA EMPRESA
  // ===============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ADMIN_GLOBAL')
  @Get('empresa/:empresaId')
  findAllByEmpresa(
    @Param('empresaId', ParseIntPipe) empresaId: number,
    @Req() req: any,
  ) {
    return this.usuariosService.findAllByEmpresa(empresaId, req.user);
  }

  // ===============================
  // VER USUARIO
  // ===============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_GLOBAL')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  // ===============================
  // UPDATE USUARIO
  // ===============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_GLOBAL')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, dto);
  }

  // ===============================
  // DELETE USUARIO
  // ===============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_GLOBAL')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}