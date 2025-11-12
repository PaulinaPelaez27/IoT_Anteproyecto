import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConexionesService } from './conexiones.service';
import { CreateConexionDto } from './dto/create-conexion.dto';
import { UpdateConexionDto } from './dto/update-conexion.dto';

@Controller('conexiones')
export class ConexionesController {
  constructor(private readonly conexionesService: ConexionesService) { }

  @Post()
  create(@Body() createConexionDto: CreateConexionDto) {
    return this.conexionesService.create(createConexionDto);
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
  update(
    @Param('id') id: string,
    @Body() updateConexionDto: UpdateConexionDto,
  ) {
    return this.conexionesService.update(+id, updateConexionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conexionesService.remove(+id);
  }
}