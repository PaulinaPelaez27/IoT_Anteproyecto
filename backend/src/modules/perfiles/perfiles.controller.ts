import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PerfilesService } from './perfiles.service';
import { CreatePerfileDto } from './dto/create-perfile.dto';
import { UpdatePerfileDto } from './dto/update-perfile.dto';

@Controller('perfiles')
export class PerfilesController {
  constructor(private readonly perfilesService: PerfilesService) {}

  @Post()
  create(@Body() createPerfileDto: CreatePerfileDto) {
    return this.perfilesService.create(createPerfileDto);
  }

  @Get()
  findAll() {
    return this.perfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.perfilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerfileDto: UpdatePerfileDto) {
    return this.perfilesService.update(+id, updatePerfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perfilesService.remove(+id);
  }
}
