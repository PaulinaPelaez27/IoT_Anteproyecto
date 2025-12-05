import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  contrasena: string;
}