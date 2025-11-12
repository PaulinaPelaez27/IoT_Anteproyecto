import { IsString, IsOptional, IsBoolean, IsInt, IsPositive, MaxLength } from 'class-validator';

export class CreateNodoDto {
    @IsString()
    @MaxLength(100)
    nombre: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    ubicacion?: string;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;

    @IsOptional()
    @IsInt()
    @IsPositive()
    proyectoId?: number;
}
