import { IsBoolean, IsInt, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateUmbralDto {
    @IsNumber()
    @IsOptional()
    valorMin?: number;

    @IsNumber()
    @IsOptional()
    valorMax?: number;

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
