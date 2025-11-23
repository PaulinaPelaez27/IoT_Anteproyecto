import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariablesService } from './variables.service';
import { VariablesController } from './variables.controller';
import { CommonModule } from 'src/infraestructura/base-datos/common-module';
import { Variable } from './entities/variable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variable]), CommonModule],
  controllers: [VariablesController],
  providers: [VariablesService],
  exports: [TypeOrmModule],
})
export class VariablesModule {}
