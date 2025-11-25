import { Controller, Get, Patch, Param, Delete, Headers, BadRequestException, Body } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { UpdateAlertaDto } from './dto/update-alerta.dto';

@Controller('alertas')
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) { }

  private getPerfil(empresaId?: string) {
    if (!empresaId || isNaN(Number(empresaId))) {
      throw new BadRequestException('Header x-empresa-id inválido o ausente');
    }
    return { p_id_empresa: Number(empresaId) };
  }

  @Get()
  findAll(@Headers('x-empresa-id') empresaId: string) {
    const perfil = this.getPerfil(empresaId);
    return this.alertasService.findAll(perfil);
  }

  @Get(':id')
  findOne(@Headers('x-empresa-id') empresaId: string, @Param('id') id: string) {
    const perfil = this.getPerfil(empresaId);
    return this.alertasService.findOne(perfil, +id);
  }

  @Patch(':id')
  update(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
    @Body() updateAlertaDto: UpdateAlertaDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.alertasService.update(perfil, +id, updateAlertaDto);
  }

  @Delete(':id')
  remove(@Headers('x-empresa-id') empresaId: string, @Param('id') id: string) {
    const perfil = this.getPerfil(empresaId);
    return this.alertasService.remove(perfil, +id);
  }
}
