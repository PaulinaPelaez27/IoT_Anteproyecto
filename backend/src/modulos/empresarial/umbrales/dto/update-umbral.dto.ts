import { PartialType } from '@nestjs/mapped-types';
import { CreateUmbralDto } from './create-umbral.dto';

export class UpdateUmbralDto extends PartialType(CreateUmbralDto) { }
