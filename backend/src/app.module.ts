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
import { VariablesModule } from './modulos/empresarial/variables/variables.module';
import { VariablesSoportaSensoresModule } from './modulos/empresarial/variables-soporta-sensores/variables-soporta-sensores.module';
import { LecturasSensoresModule } from './modulos/empresarial/lecturas-sensores/lecturas-sensores.module';
import { UmbralesModule } from './modulos/empresarial/umbrales/umbrales.module';
import { AlertasModule } from './modulos/empresarial/alertas/alertas.module';
import { UsuariosModule } from './modulos/nucleo/usuarios/usuarios.module';
import { RolesUsuariosModule } from './modulos/nucleo/roles-usuarios/roles-usuarios.module';
import { PerfilesModule } from './modulos/nucleo/perfiles/perfiles.module';
import { AlertasUsuariosModule } from './modulos/empresarial/alertas-usuarios/alertas-usuarios.module';
import { BullModule } from '@nestjs/bullmq';
import { ColaIotModule } from './modulos/iot/cola-iot/cola-iot.module';


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
        // Por seguridad en entornos de producción y multiinquilino deshabilitamos la sincronización del esquema
        // y confiamos en las migraciones. Forzar explícitamente `synchronize: false` según las reglas del proyecto.
        synchronize: false,
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
    VariablesModule,
    VariablesSoportaSensoresModule,
    LecturasSensoresModule,
    UmbralesModule,
    AlertasModule,
    UsuariosModule,
    RolesUsuariosModule,
    PerfilesModule,
    AlertasUsuariosModule,
    ColaIotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
