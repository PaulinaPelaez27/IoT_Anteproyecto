import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAlertaDto {
    @IsOptional()
    @IsBoolean()
    estado?: boolean;
}
