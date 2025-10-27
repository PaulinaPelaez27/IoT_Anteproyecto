import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatosCrudosService } from './datos-crudos.service';
import { CreateDatosCrudoDto } from './dto/create-datos-crudo.dto';
import { UpdateDatosCrudoDto } from './dto/update-datos-crudo.dto';

@Controller('datos-crudos')
export class DatosCrudosController {
  constructor(private readonly datosCrudosService: DatosCrudosService) {}

  @Post()
  create(@Body() createDatosCrudoDto: CreateDatosCrudoDto) {
    return this.datosCrudosService.create(createDatosCrudoDto);
  }

  @Get()
  findAll() {
    return this.datosCrudosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datosCrudosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatosCrudoDto: UpdateDatosCrudoDto) {
    return this.datosCrudosService.update(+id, updateDatosCrudoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.datosCrudosService.remove(+id);
  }
}
