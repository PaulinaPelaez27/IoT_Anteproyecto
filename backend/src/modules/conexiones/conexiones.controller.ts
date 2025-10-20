import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConexionesService } from './conexiones.service';
import { CreateConexioneDto } from './dto/create-conexione.dto';
import { UpdateConexioneDto } from './dto/update-conexione.dto';

@Controller('conexiones')
export class ConexionesController {
  constructor(private readonly conexionesService: ConexionesService) {}

  @Post()
  create(@Body() createConexioneDto: CreateConexioneDto) {
    return this.conexionesService.create(createConexioneDto);
  }

  @Get()
  findAll() {
    return this.conexionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conexionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConexioneDto: UpdateConexioneDto) {
    return this.conexionesService.update(+id, updateConexioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conexionesService.remove(+id);
  }
}
