import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresaDto } from './create-empresa.dto';

/**
 * DTO para actualización parcial de una Empresa.
 *
 * Extiende `CreateEmpresaDto` usando `PartialType` para hacer opcionales
 * todos los campos. Mantiene las validaciones definidas en el DTO de creación
 * (si se utiliza `ValidationPipe` en la aplicación, las reglas de
 * `class-validator` en `CreateEmpresaDto` seguirán aplicándose).
 */
export class UpdateEmpresaDto extends PartialType(CreateEmpresaDto) {}
