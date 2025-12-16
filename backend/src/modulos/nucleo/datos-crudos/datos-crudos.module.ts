import { Module } from '@nestjs/common';
import { DatosCrudosService } from './datos-crudos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatoCrudo } from './entities/dato-crudo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatoCrudo])],
  providers: [DatosCrudosService],
  exports: [DatosCrudosService],
})
export class DatosCrudosModule {}
