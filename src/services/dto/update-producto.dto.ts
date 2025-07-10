import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
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

  @ApiPropertyOptional({ example: 120.5 })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : Number(value),
    { toClassOnly: true }
  )
  @IsNumber({}, { message: 'precio debe ser numérico' })
  @Min(0.01, { message: 'precio debe ser mayor que 0' })
  precio?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : Number(value),
    { toClassOnly: true }
  )
  @IsNumber({}, { message: 'activo debe ser 0 o 1' })
  activo?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : Number(value),
    { toClassOnly: true }
  )
  @IsNumber({}, { message: 'id_subcategoria debe ser numérico' })
  id_subcategoria?: number;

  @IsOptional()
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  imagen?: any;
}
