import { PartialType } from '@nestjs/mapped-types';
import { CreateDatosCrudoDto } from './create-datos-crudo.dto';

export class UpdateDatosCrudoDto extends PartialType(CreateDatosCrudoDto) {}
