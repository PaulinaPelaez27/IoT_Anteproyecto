import { IsString, IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateProyectoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(45)
    nombre: string;

    @IsString()
    @IsOptional()
    @MaxLength(250)
    descripcion?: string | null;

    @IsBoolean()
    @IsOptional()
    estado?: boolean;
}
