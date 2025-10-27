import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { DatosCrudosService } from './datos-crudos.service';

@Controller('datos-crudos')
export class DatosCrudosController {
  constructor(private readonly datosCrudosService: DatosCrudosService) {}

  @Post()
  create() {
    return this.datosCrudosService.create();
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
  update(@Param('id') id: string) {
    return this.datosCrudosService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.datosCrudosService.remove(+id);
  }
}
