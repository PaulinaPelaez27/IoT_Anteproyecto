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
import { Roles } from './modulos/nucleo/auth/guards/roles.decorator';
import { RolesUsuariosModule } from './modulos/nucleo/roles-usuarios/roles-usuarios.module';
import { Perfil } from './modulos/nucleo/perfiles/entities/perfil.entity';
import { PerfilesModule } from './modulos/nucleo/perfiles/perfiles.module';

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
        // For safety in production and multi-tenant environments we disable schema sync
        // and rely on migrations. Explicitly force `synchronize: false` per project rules.
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
