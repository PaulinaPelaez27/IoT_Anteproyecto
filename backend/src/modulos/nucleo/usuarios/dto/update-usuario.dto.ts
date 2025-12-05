import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  contrasena?: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}