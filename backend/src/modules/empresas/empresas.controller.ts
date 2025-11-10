import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  async create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return await this.empresasService.create(createEmpresaDto);
  }

  @Get()
  async findAll() {
    return await this.empresasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.empresasService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
  ) {
    return await this.empresasService.update(id, updateEmpresaDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.empresasService.remove(id);
  }
}
