import { IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';

export class UpdateRolUsuarioDto {
  @IsString()
  @IsOptional()
  @MaxLength(45)
  nombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}