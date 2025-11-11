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
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) { }

  /** Helper privado para generar el perfil */
  private getPerfil(empresaId?: string) {
    console.log('empresaId recibido en getPerfil:', empresaId);
    if (!empresaId || isNaN(Number(empresaId))) {
      throw new BadRequestException('Header x-empresa-id inválido o ausente');
    }
    return { p_id_empresa: Number(empresaId) };
  }

  @Post()
  create(
    @Headers('x-empresa-id') empresaId: string,
    @Body() createProyectoDto: CreateProyectoDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.proyectosService.create(perfil, createProyectoDto);
  }

  @Get()
  findAll(@Headers('x-empresa-id') empresaId: string) {
    console.log('empresaId en ProyectosController.findAll:', empresaId);
    const perfil = this.getPerfil(empresaId);
    return this.proyectosService.findAll(perfil);
  }

  @Get(':id')
  findOne(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.proyectosService.findOne(perfil, +id);
  }

  @Patch(':id')
  update(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
    @Body() updateProyectoDto: UpdateProyectoDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.proyectosService.update(perfil, +id, updateProyectoDto);
  }

  @Delete(':id')
  remove(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.proyectosService.remove(perfil, +id);
  }
}
