import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateProductoTextDto {
  @ApiPropertyOptional({ example: 'Nuevo nombre' })
  @IsOptional() @IsString() nombre?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción' })
  @IsOptional() @IsString() descripcion?: string;

  @ApiPropertyOptional({ example: 150.75 })
  @IsOptional() @Transform(({ value }) => value ? Number(value) : undefined)
  @IsNumber() @Min(0.01) precio?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional() @Transform(({ value }) => value ? Number(value) : undefined)
  @IsNumber() activo?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional() @Transform(({ value }) => value ? Number(value) : undefined)
  @IsNumber() id_subcategoria?: number;

  @ApiPropertyOptional({ example: 'https://cdn.miapp.com/images/nuevo.jpg' })
  @IsOptional() @IsString() imagen?: string;
}
