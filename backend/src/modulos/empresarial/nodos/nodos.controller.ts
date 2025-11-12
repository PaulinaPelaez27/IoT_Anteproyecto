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
import { NodosService } from './nodos.service';
import { CreateNodoDto } from './dto/create-nodo.dto';
import { UpdateNodoDto } from './dto/update-nodo.dto';

@Controller('nodos')
export class NodosController {
  constructor(private readonly nodosService: NodosService) {}

  /** Helper privado para generar el perfil desde el header */
  private getPerfil(empresaId?: string) {
    if (!empresaId || isNaN(Number(empresaId))) {
      throw new BadRequestException('Header x-empresa-id inválido o ausente');
    }
    return { p_id_empresa: Number(empresaId) };
  }

  /** Crear nodo */
  @Post()
  create(
    @Headers('x-empresa-id') empresaId: string,
    @Body() createNodoDto: CreateNodoDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.nodosService.create(perfil, createNodoDto);
  }

  /** Listar todos los nodos */
  @Get()
  findAll(@Headers('x-empresa-id') empresaId: string) {
    const perfil = this.getPerfil(empresaId);
    return this.nodosService.findAll(perfil);
  }

  /** Obtener nodo por ID */
  @Get(':id')
  findOne(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.nodosService.findOne(perfil, +id);
  }

  /** Actualizar nodo */
  @Patch(':id')
  update(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
    @Body() updateNodoDto: UpdateNodoDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.nodosService.update(perfil, +id, updateNodoDto);
  }

  /** Eliminar nodo (borrado lógico) */
  @Delete(':id')
  remove(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.nodosService.remove(perfil, +id);
  }
}
