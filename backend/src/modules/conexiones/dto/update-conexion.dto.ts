import { PartialType } from '@nestjs/mapped-types';
import { CreateConexionDto } from './create-conexion.dto';

export class UpdateConexionDto extends PartialType(CreateConexionDto) {}