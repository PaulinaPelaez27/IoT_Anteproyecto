import { Module } from '@nestjs/common';
import { ConexionesService } from './conexiones.service';
import { ConexionesController } from './conexiones.controller';

@Module({
  controllers: [ConexionesController],
  providers: [ConexionesService],
})
export class ConexionesModule {}
