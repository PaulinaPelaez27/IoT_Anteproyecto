import { PartialType } from '@nestjs/mapped-types';
import { CreateConexioneDto } from './create-conexione.dto';

export class UpdateConexioneDto extends PartialType(CreateConexioneDto) {}
