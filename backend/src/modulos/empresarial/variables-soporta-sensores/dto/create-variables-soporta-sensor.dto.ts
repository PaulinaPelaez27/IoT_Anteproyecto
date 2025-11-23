import { IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateVariablesSoportaSensorDto {
    @IsInt()
    @Min(1)
    sensorId: number;

    @IsInt()
    @Min(1)
    variableId: number;

    @IsBoolean()
    @IsOptional()
    estado?: boolean;
}
