import { IsString, IsOptional, IsEmail, IsBoolean, Length } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para la creación de una Empresa.
 * Se incluyen validaciones básicas basadas en los campos de la entidad `Empresa`.
 */
export class CreateEmpresaDto {
    @IsString()
    @Length(1, 45)
    nombre: string;

    @IsOptional()
    @IsString()
    @Length(0, 250)
    descripcion?: string;

    @IsOptional()
    @IsEmail()
    @Length(0, 100)
    email?: string;

    @IsOptional()
    @IsString()
    @Length(0, 20)
    numeroTel?: string;

    @IsOptional()
    @IsString()
    @Length(0, 100)
    responsable?: string;

    // El estado por defecto en la entidad es `true`. Permitimos override booleano opcionalmente.
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    estado?: boolean;
}
