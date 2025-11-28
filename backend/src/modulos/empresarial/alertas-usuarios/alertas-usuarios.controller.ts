import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  Body,
} from '@nestjs/common';
import type { Request } from 'express';
import { AlertasUsuariosService } from './alertas-usuarios.service';
import { UpdateAlertasUsuarioDto } from './dto/update-alertas-usuario.dto';

@Controller('alertas-usuario')
export class AlertasUsuariosController {
  constructor(private readonly alertasUsuariosService: AlertasUsuariosService) { }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('soloNoLeidas') soloNoLeidas?: string,
    @Query('alertaId') alertaId?: string,
  ) {
    const usuarioId = (req as any).user?.sub ?? (req as any).user?.id ?? (req as any).user?.userId;
    if (!usuarioId) throw new BadRequestException('Usuario no autenticado');

    const soloNoLeidasBool = soloNoLeidas === undefined ? undefined : soloNoLeidas === 'true';
    const alertaIdNum = alertaId ? parseInt(alertaId, 10) : undefined;

    const perfil = (req as any).user?.perfil ?? (req as any).perfil;

    return this.alertasUsuariosService.findAll(perfil, usuarioId, {
      soloNoLeidas: soloNoLeidasBool,
      alertaId: alertaIdNum,
    });
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const usuarioId = (req as any).user?.sub ?? (req as any).user?.id ?? (req as any).user?.userId;
    if (!usuarioId) throw new BadRequestException('Usuario no autenticado');

    const perfil = (req as any).user?.perfil ?? (req as any).perfil;

    return this.alertasUsuariosService.findOne(perfil, +id, usuarioId);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateAlertasUsuarioDto,
  ) {
    const usuarioId = (req as any).user?.sub ?? (req as any).user?.id ?? (req as any).user?.userId;
    if (!usuarioId) throw new BadRequestException('Usuario no autenticado');

    const perfil = (req as any).user?.perfil ?? (req as any).perfil;

    return this.alertasUsuariosService.update(perfil, +id, usuarioId, dto);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const usuarioId = (req as any).user?.sub ?? (req as any).user?.id ?? (req as any).user?.userId;
    if (!usuarioId) throw new BadRequestException('Usuario no autenticado');

    const perfil = (req as any).user?.perfil ?? (req as any).perfil;

    return this.alertasUsuariosService.softDelete(perfil, +id, usuarioId);
  }
}