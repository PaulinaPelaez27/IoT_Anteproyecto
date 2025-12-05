import { IsString, IsOptional, IsBoolean, IsInt, IsPositive, MaxLength } from 'class-validator';

export class CreateNodoDto {
    @IsString()
    @MaxLength(45)
    nombre: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    ubicacion?: string | null;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;

    @IsInt()
    @IsPositive()
    proyectoId: number;
}
