import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRolUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  descripcion?: string | null;
}