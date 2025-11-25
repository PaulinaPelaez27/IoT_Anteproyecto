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
  Req,
  ForbiddenException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =============================
  // LOGIN (PÚBLICO)
  // =============================
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  // =============================
  // ADMIN GLOBAL — LISTA TODOS
  // =============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_GLOBAL')
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  // =============================
  // LISTAR USUARIOS POR EMPRESA
  // =============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ADMIN_GLOBAL')
  @Get('empresa/:empresaId')
  findAllByEmpresa(
    @Param('empresaId', ParseIntPipe) empresaId: number,
    @Req() req: any,
  ) {
    const usuario = req.user;

    // Admin global → sin restricciones
    if (usuario.roles.includes('ADMIN_GLOBAL')) {
      return this.authService.findAllByEmpresa(empresaId);
    }

    // Admin normal → solo su empresa
    if (!usuario.empresas.includes(empresaId)) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a esta empresa.',
      );
    }

    return this.authService.findAllByEmpresa(empresaId);
  }

  // =============================
  // VER USUARIO POR ID
  // =============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_GLOBAL')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authService.findOne(id);
  }

  // =============================
  // UPDATE USUARIO
  // =============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_GLOBAL')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthDto: UpdateAuthDto,
  ) {
    return this.authService.update(id, updateAuthDto);
  }

  // =============================
  // BORRADO LÓGICO
  // =============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_GLOBAL')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authService.remove(id);
  }
}