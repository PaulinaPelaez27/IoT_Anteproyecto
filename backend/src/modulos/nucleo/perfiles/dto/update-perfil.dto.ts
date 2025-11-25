import { PartialType } from '@nestjs/mapped-types';
import { CreatePerfilDto } from './create-perfil.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePerfilDto extends PartialType(CreatePerfilDto) {
  @IsBoolean()
  @IsOptional()
  estado?: boolean;

  @IsBoolean()
  @IsOptional()
  borrado?: boolean;
}