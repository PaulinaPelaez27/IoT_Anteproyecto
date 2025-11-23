import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsDateString } from 'class-validator';

export class CreateLecturasSensorDto {
    @IsString()
    @IsNotEmpty()
    valor: string;

    @IsInt()
    @IsPositive()
    sensorId: number;

    @IsInt()
    @IsPositive()
    variableId: number;
}
