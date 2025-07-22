import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiPropertyOptional({ example: 'Nombre del producto' })
  @IsString()
  nombre!: string;

  @ApiPropertyOptional({ example: 'Descripción del producto' })
  @IsString()
  descripcion!: string;

  @ApiPropertyOptional({ example: 100.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01, { message: 'El precio debe ser mayor que 0' })
  precio!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_restaurante?: number;

  @ApiPropertyOptional({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  id_subcategoria!: number;

  // Si quieres permitir enviar el estado inicial
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  activo?: number;
}
