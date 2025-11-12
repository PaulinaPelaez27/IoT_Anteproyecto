import { PartialType } from '@nestjs/mapped-types';
import { CreateRolesUsuarioDto } from './create-roles-usuario.dto';

export class UpdateRolesUsuarioDto extends PartialType(CreateRolesUsuarioDto) {}
