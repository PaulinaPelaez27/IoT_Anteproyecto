import { Module } from '@nestjs/common';
import { AlertasUsuariosService } from './alertas-usuarios.service';
import { AlertasUsuariosController } from './alertas-usuarios.controller';
import { CommonModule } from '../../../infraestructura/base-datos/common-module';

@Module({
  imports: [CommonModule],
  controllers: [AlertasUsuariosController],
  providers: [AlertasUsuariosService],
})
export class AlertasUsuariosModule { }
