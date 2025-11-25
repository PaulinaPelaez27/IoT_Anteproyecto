import { IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreatePerfilDto {
  @IsInt()
  @Min(1)
  usuarioId: number;

  @IsInt()
  @Min(1)
  empresaId: number;

  @IsInt()
  @Min(1)
  rolId: number;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;
}