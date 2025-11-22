import { 
    IsBoolean, 
    IsInt, 
    IsOptional, 
    IsPositive, 
    IsString, 
    MaxLength 
} from "class-validator";

export class CreateSensorDto {

    @IsString()
    @MaxLength(45)
    nombre: string;

    @IsBoolean()
    @IsOptional()
    estado?: boolean;

    @IsInt()
    @IsPositive()
    nodoId: number;    
}