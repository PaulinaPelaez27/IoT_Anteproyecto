import { PartialType } from '@nestjs/mapped-types';
import { CreateLecturasSensorDto } from './create-lecturas-sensor.dto';

export class UpdateLecturasSensorDto extends PartialType(CreateLecturasSensorDto) { }