import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './infraestructura/base-datos/common-module';
import { join } from 'path';
import { AuthModule } from './modulos/nucleo/auth/auth.module';
import { ProyectosModule } from './modulos/empresarial/proyectos/proyectos.module';
import { EmpresasModule } from './modulos/nucleo/empresas/empresas.module';
import { ConexionesModule } from './modulos/nucleo/conexiones/conexiones.module';
import { NodosModule } from './modulos/empresarial/nodos/nodos.module';
import { SensoresModule } from './modulos/empresarial/sensores/sensores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASS', 'postgres'),
        database: config.get<string>('DB_NAME', 'test'),
        entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
        synchronize: config.get<string>('DB_SYNC', 'false') === 'true',
        logging: config.get<string>('DB_LOGGING', 'false') === 'true',
      }),
    }),
    AuthModule,
    EmpresasModule,
    ProyectosModule,
    ConexionesModule,
    CommonModule,
    NodosModule,
    SensoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
