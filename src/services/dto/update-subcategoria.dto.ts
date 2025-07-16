import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsInt, Min, Max } from 'class-validator';

export class UpdateSubcategoriaDto {
    @ApiPropertyOptional({ example: 'Refrescos Naturales', description: 'Nuevo nombre de la subcategoría' })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    nombre?: string;

    @ApiPropertyOptional({ example: 0, description: 'Estado de la subcategoría: 1=activa, 0=inactiva' })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    activa?: number;
}
