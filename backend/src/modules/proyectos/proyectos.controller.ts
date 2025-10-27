import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { log } from 'node:console';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Post()
  create(
    @Headers('x-empresa-id') empresaId: string | undefined,
    @Body() createProyectoDto: CreateProyectoDto,
  ) {
    const perfil = { p_id_empresa: empresaId ? Number(empresaId) : undefined };
    return this.proyectosService.create(perfil, createProyectoDto);
  }

  @Get()
  findAll(@Headers('x-empresa-id') empresaId: string | undefined) {
    console.log(
      'ProyectosController.findAll called with empresaId:',
      empresaId,
    );
    const perfil = { p_id_empresa: empresaId ? Number(empresaId) : undefined };
    return this.proyectosService.findAll(perfil);
  }

  @Get(':id')
  findOne(
    @Headers('x-empresa-id') empresaId: string | undefined,
    @Param('id') id: string,
  ) {
    const perfil = { p_id_empresa: empresaId ? Number(empresaId) : undefined };
    return this.proyectosService.findOne(perfil, +id);
  }

  @Patch(':id')
  update(
    @Headers('x-empresa-id') empresaId: string | undefined,
    @Param('id') id: string,
    @Body() updateProyectoDto: UpdateProyectoDto,
  ) {
    const perfil = { p_id_empresa: empresaId ? Number(empresaId) : undefined };
    return this.proyectosService.update(perfil, +id, updateProyectoDto);
  }

  @Delete(':id')
  remove(
    @Headers('x-empresa-id') empresaId: string | undefined,
    @Param('id') id: string,
  ) {
    const perfil = { p_id_empresa: empresaId ? Number(empresaId) : undefined };
    return this.proyectosService.remove(perfil, +id);
  }
}
