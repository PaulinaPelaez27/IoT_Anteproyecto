import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateConexioneDto {
  @IsInt()
  @Min(1)
  empresaId: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  host?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  puerto?: number;

  @IsString()
  @MaxLength(100)
  nombreBaseDeDatos: string;

  @IsString()
  @MaxLength(50)
  usuario: string;

  @IsString()
  @MaxLength(255)
  contrasena: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsBoolean()
  borrado?: boolean;
}
