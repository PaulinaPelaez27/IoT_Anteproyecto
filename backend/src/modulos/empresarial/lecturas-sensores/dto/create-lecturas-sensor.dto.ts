import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

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
