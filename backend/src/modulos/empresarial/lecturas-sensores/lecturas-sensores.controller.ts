import { Controller, Get, Post, Body, Param, Delete, Headers, BadRequestException } from '@nestjs/common';
import { LecturasSensoresService } from './lecturas-sensores.service';
import { CreateLecturasSensorDto } from './dto/create-lecturas-sensor.dto';

@Controller('lecturas-sensores')
export class LecturasSensoresController {
  constructor(private readonly lecturasSensoresService: LecturasSensoresService) { }
  /** Helper privado para generar el perfil desde el header */
  private getPerfil(empresaId?: string) {
    if (!empresaId || isNaN(Number(empresaId))) {
      throw new BadRequestException('Header x-empresa-id inválido o ausente');
    }
    return { p_id_empresa: Number(empresaId) };
  }
  @Post()
  create(
    @Headers('x-empresa-id') empresaId: string,
    @Body() createLecturasSensorDto: CreateLecturasSensorDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.lecturasSensoresService.create(perfil, createLecturasSensorDto);
  }

  @Get()
  findAll(@Headers('x-empresa-id') empresaId: string) {
    const perfil = this.getPerfil(empresaId);
    return this.lecturasSensoresService.findAll(perfil);
  }

  @Get(':id')
  findOne(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.lecturasSensoresService.findOne(perfil, +id);
  }

  @Delete(':id')
  remove(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.lecturasSensoresService.remove(perfil, +id);
  }
}
