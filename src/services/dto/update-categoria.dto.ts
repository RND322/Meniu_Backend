import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsInt, Min, Max } from 'class-validator';

export class UpdateCategoriaDto {
    @ApiPropertyOptional({ example: 'Bebidas Frías', description: 'Nuevo nombre de la categoría' })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    nombre?: string;

    @ApiPropertyOptional({ example: 0, description: 'Estado de la categoría: 1=activa, 0=inactiva' })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    activa?: number;
}
