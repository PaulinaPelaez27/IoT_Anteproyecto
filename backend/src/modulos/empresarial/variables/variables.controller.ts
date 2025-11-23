import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Headers } from '@nestjs/common';
import { VariablesService } from './variables.service';
import { CreateVariableDto } from './dto/create-variable.dto';
import { UpdateVariableDto } from './dto/update-variable.dto';

@Controller('variables')
export class VariablesController {
  constructor(private readonly variablesService: VariablesService) { }

  private getPerfil(empresaId?: string) {
    if (!empresaId || isNaN(Number(empresaId))) {
      throw new BadRequestException('Header x-empresa-id inválido o ausente');
    }
    return { p_id_empresa: Number(empresaId) };
  }

  @Post()
  create(@Headers('x-empresa-id') empresaId: string, @Body() createVariableDto: CreateVariableDto) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesService.create(perfil, createVariableDto);
  }

  @Get()
  findAll(@Headers('x-empresa-id') empresaId: string) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesService.findAll(perfil);
  }

  @Get(':id')
  findOne(@Headers('x-empresa-id') empresaId: string, @Param('id') id: string) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesService.findOne(perfil, +id);
  }

  @Patch(':id')
  update(@Headers('x-empresa-id') empresaId: string, @Param('id') id: string, @Body() updateVariableDto: UpdateVariableDto) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesService.update(perfil, +id, updateVariableDto);
  }

  @Delete(':id')
  remove(@Headers('x-empresa-id') empresaId: string, @Param('id') id: string) {
    const perfil = this.getPerfil(empresaId);
    return this.variablesService.remove(perfil, +id);
  }
}
