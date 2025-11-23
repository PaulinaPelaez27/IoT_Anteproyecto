import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariablesSoportaSensoresService } from './variables-soporta-sensores.service';
import { VariablesSoportaSensoresController } from './variables-soporta-sensores.controller';
import { VariablesSoportaSensor } from './entities/variables-soporta-sensor.entity';
import { CommonModule } from 'src/infraestructura/base-datos/common-module';

@Module({
  imports: [TypeOrmModule.forFeature([VariablesSoportaSensor]), CommonModule],
  controllers: [VariablesSoportaSensoresController],
  providers: [VariablesSoportaSensoresService],
  exports: [TypeOrmModule],
})
export class VariablesSoportaSensoresModule { }
