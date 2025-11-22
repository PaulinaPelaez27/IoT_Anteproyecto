import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { SensoresService } from './sensores.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Controller('sensores')
export class SensoresController {
  constructor(private readonly sensoresService: SensoresService) { }

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
    @Body() createSensorDto: CreateSensorDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.sensoresService.create(perfil, createSensorDto);
  }

  @Get()
  findAll(@Headers('x-empresa-id') empresaId: string) {
    const perfil = this.getPerfil(empresaId);
    return this.sensoresService.findAll(perfil);
  }

  @Get(':id')
  findOne(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.sensoresService.findOne(perfil, +id);
  }

  @Patch(':id')
  update(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
    @Body() updateSensorDto: UpdateSensorDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.sensoresService.update(perfil, +id, updateSensorDto);
  }

  @Delete(':id')
  remove(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.sensoresService.remove(perfil, +id);
  }
}
