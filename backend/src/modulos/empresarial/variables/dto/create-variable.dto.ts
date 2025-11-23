import { IsString, IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateVariableDto {
        @IsString()
        @IsNotEmpty()
        @MaxLength(100)
        nombre: string;

        @IsString()
        @IsOptional()
        @MaxLength(15)
        unidad?: string;

        @IsString()
        @IsOptional()
        @MaxLength(250)
        descripcion?: string;

        @IsString()
        @IsNotEmpty()
        @MaxLength(15)
        varJson: string;

        @IsBoolean()
        @IsOptional()
        estado?: boolean;
}
