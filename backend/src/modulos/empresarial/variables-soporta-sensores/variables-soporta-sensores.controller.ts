import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, BadRequestException } from '@nestjs/common';
import { VariablesSoportaSensoresService } from './variables-soporta-sensores.service';
import { CreateVariablesSoportaSensorDto } from './dto/create-variables-soporta-sensor.dto';
import { UpdateVariablesSoportaSensorDto } from './dto/update-variables-soporta-sensor.dto';

@Controller('variables-soporta-sensores')
export class VariablesSoportaSensoresController {
  constructor(private readonly variablesSoportaSensoresService: VariablesSoportaSensoresService) { }

  private getPerfil(empresaId?: string) {
    if (!empresaId || isNaN(Number(empresaId))) {
      throw new BadRequestException('Header x-empresa-id inválido o ausente');
    }
    return { p_id_empresa: Number(empresaId) };
  }

  @Post()
  create(@Headers('x-empresa-id') empresaId: string, @Body() createDto: CreateVariablesSoportaSensorDto) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesSoportaSensoresService.create(perfil, createDto);
  }

  @Get()
  findAll(@Headers('x-empresa-id') empresaId: string) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesSoportaSensoresService.findAll(perfil);
  }

  @Get(':sensorId/:variableId')
  findOne(@Headers('x-empresa-id') empresaId: string, @Param('sensorId') sensorId: string, @Param('variableId') variableId: string) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesSoportaSensoresService.findOne(perfil, +sensorId, +variableId);
  }

  @Patch(':sensorId/:variableId')
  update(@Headers('x-empresa-id') empresaId: string, @Param('sensorId') sensorId: string, @Param('variableId') variableId: string, @Body() updateDto: UpdateVariablesSoportaSensorDto) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesSoportaSensoresService.update(perfil, +sensorId, +variableId, updateDto);
  }

  @Delete(':sensorId/:variableId')
  remove(@Headers('x-empresa-id') empresaId: string, @Param('sensorId') sensorId: string, @Param('variableId') variableId: string) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesSoportaSensoresService.remove(perfil, +sensorId, +variableId);
  }
}
