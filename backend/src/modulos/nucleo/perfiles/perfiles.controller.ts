import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';

import { PerfilesService } from './perfiles.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('perfiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // Solo el admin puede gestionar perfiles
export class PerfilesController {
  constructor(private readonly perfilesService: PerfilesService) {}

  @Post()
  create(@Body() dto: CreatePerfilDto) {
    return this.perfilesService.create(dto);
  }

  @Get()
  findAll() {
    return this.perfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.perfilesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePerfilDto,
  ) {
    return this.perfilesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.perfilesService.remove(id);
  }
}