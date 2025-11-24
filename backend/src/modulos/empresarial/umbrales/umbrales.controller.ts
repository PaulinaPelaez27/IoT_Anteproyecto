import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, BadRequestException } from '@nestjs/common';
import { UmbralesService } from './umbrales.service';
import { CreateUmbralDto } from './dto/create-umbral.dto';
import { UpdateUmbralDto } from './dto/update-umbral.dto';

@Controller('umbrales')
export class UmbralesController {
  constructor(private readonly umbralesService: UmbralesService) { }

  private getPerfil(empresaId?: string) {
    if (!empresaId || isNaN(Number(empresaId))) {
      throw new BadRequestException('Header x-empresa-id inválido o ausente');
    }
    return { p_id_empresa: Number(empresaId) };
  }

  @Post()
  create(
    @Headers('x-empresa-id') empresaId: string,
    @Body() createUmbralDto: CreateUmbralDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.umbralesService.create(perfil, createUmbralDto);
  }

  @Get()
  findAll(@Headers('x-empresa-id') empresaId: string) {
    const perfil = this.getPerfil(empresaId);
    return this.umbralesService.findAll(perfil);
  }

  @Get(':id')
  findOne(@Headers('x-empresa-id') empresaId: string, @Param('id') id: string) {
    const perfil = this.getPerfil(empresaId);
    return this.umbralesService.findOne(perfil, +id);
  }

  @Patch(':id')
  update(
    @Headers('x-empresa-id') empresaId: string,
    @Param('id') id: string,
    @Body() updateUmbralDto: UpdateUmbralDto,
  ) {
    const perfil = this.getPerfil(empresaId);
    return this.umbralesService.update(perfil, +id, updateUmbralDto);
  }

  @Delete(':id')
  remove(@Headers('x-empresa-id') empresaId: string, @Param('id') id: string) {
    const perfil = this.getPerfil(empresaId);
    return this.umbralesService.remove(perfil, +id);
  }
}
