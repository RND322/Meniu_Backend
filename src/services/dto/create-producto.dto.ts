import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiPropertyOptional({ example: 'Nombre del producto' })
  @IsString()
  nombre!: string;

  @ApiPropertyOptional({ example: 'Descripcion del producto' })
  @IsString()
  descripcion!: string;

  @ApiPropertyOptional({ example: 'Precio del producto' })
  @IsNumber()
  @Type(() => Number) // <- esto convierte el texto a número
  precio!: number;

  @ApiPropertyOptional({ example: 'ID de restaurante al que pertenece del producto' })
  @IsNumber()
  @Type(() => Number)
  id_restaurante!: number;

  @ApiPropertyOptional({ example: 'ID de la seubcategoria al que pertenece del product' })
  @IsNumber()
  @Type(() => Number)
  id_subcategoria!: number;
}
