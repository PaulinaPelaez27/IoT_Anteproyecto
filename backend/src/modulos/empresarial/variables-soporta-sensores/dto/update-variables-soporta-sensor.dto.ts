import { PartialType } from '@nestjs/mapped-types';
import { CreateVariablesSoportaSensorDto } from './create-variables-soporta-sensor.dto';

export class UpdateVariablesSoportaSensorDto extends PartialType(CreateVariablesSoportaSensorDto) { }