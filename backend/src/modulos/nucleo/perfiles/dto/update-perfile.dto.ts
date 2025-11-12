import { PartialType } from '@nestjs/mapped-types';
import { CreatePerfileDto } from './create-perfile.dto';

export class UpdatePerfileDto extends PartialType(CreatePerfileDto) {}
