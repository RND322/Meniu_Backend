import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateMesaTextDto {
    @ApiPropertyOptional({ example: 2, description: 'Nuevo número de mesa' })
    @Transform(({ value }) => (value != null ? parseInt(value, 10) : undefined))
    @IsOptional()
    @IsNumber()
    numero_mesa?: number;

    @ApiPropertyOptional({ example: 'Inactiva', enum: ['Activa', 'Inactiva'] })
    @IsOptional()
    @IsString()
    estado_mesa?: string;

    @ApiPropertyOptional({
        example: '/uploads/mesas/qr_654321.png',
        description: 'URL o texto del nuevo código QR',
    })
    @IsOptional()
    @IsString()
    qr_code?: string;
}
