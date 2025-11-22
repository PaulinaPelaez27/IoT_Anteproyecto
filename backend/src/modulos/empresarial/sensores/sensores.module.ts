import { Module } from '@nestjs/common';
import { SensoresService } from './sensores.service';
import { SensoresController } from './sensores.controller';
import { CommonModule } from 'src/infraestructura/base-datos/common-module';

@Module({
  imports: [CommonModule],
  controllers: [SensoresController],
  providers: [SensoresService],
})
export class SensoresModule { }
