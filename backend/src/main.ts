import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir llamadas del frontend (localhost:4200)
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization, x-empresa-id',
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
}
void bootstrap();
