/*

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
*/
// src/services/dto/create-producto.dto.ts
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

  // Lo vamos a setear desde el JWT, no lo envía el cliente
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
