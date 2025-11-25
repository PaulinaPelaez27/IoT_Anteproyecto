import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAlertasUsuarioDto {
    @IsOptional()
    @IsBoolean()
    leido?: boolean;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;
}
