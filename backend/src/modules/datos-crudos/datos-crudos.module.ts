import { Module } from '@nestjs/common';
import { DatosCrudosService } from './datos-crudos.service';
import { DatosCrudosController } from './datos-crudos.controller';

@Module({
  controllers: [DatosCrudosController],
  providers: [DatosCrudosService],
})
export class DatosCrudosModule {}
