import { IsBoolean, IsInt, IsNumber, IsPositive, IsOptional, Validate, ValidateIf } from 'class-validator';
import { UmbralRangoValidador } from '../validador';


export class CreateUmbralDto {
    @IsNumber()
    valorMin: number;

    @IsNumber()
    valorMax: number;

    @ValidateIf(o => o.valorMin !== undefined && o.valorMax !== undefined)
    @Validate(UmbralRangoValidador)
    rangoValido!: boolean;

    @IsBoolean()
    @IsOptional()
    estado?: boolean;

    @IsInt()
    @IsPositive()
    sensorId: number;

    @IsInt()
    @IsPositive()
    variableId: number;
}
