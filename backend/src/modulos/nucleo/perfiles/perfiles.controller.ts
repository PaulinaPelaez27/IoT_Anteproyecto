import { Controller, Get, Post, Patch, Param, Delete } from '@nestjs/common';
import { PerfilesService } from './perfiles.service';

@Controller('perfiles')
export class PerfilesController {
  constructor(private readonly perfilesService: PerfilesService) {}

  @Post()
  create() {
    return this.perfilesService.create();
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
  update(@Param('id') id: string) {
    return this.perfilesService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perfilesService.remove(+id);
  }
}
