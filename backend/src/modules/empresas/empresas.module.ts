import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { EmpresasService } from './empresas.service';
import { EmpresasController } from './empresas.controller';
import { ConexionesModule } from '../conexiones/conexiones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empresa]),
    forwardRef(() => ConexionesModule),
  ],
  controllers: [EmpresasController],
  providers: [EmpresasService],
  exports: [EmpresasService],
})
export class EmpresasModule {}
