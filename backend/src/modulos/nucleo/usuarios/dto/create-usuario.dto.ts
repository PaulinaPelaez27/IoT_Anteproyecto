import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  contrasena: string;
}