import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodosService } from './nodos.service';
import { NodosController } from './nodos.controller';
import { Nodo } from './entities/nodo.entity';
import { CommonModule } from 'src/infraestructura/base-datos/common-module';

@Module({
  imports: [TypeOrmModule.forFeature([Nodo]), CommonModule],
  controllers: [NodosController],
  providers: [NodosService],
  exports: [TypeOrmModule],
})
export class NodosModule { }
