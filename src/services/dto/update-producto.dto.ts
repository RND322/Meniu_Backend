import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductoDto {
  @ApiPropertyOptional({ example: 'Nuevo nombre del producto' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ example: 120.50 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  precio?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id_subcategoria?: number;

  @ApiPropertyOptional({ example: 1, description: '1 = activo, 0 = inactivo' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  activo?: number;
}
