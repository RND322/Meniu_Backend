import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsPositive, IsOptional, IsString } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 42, description: 'ID del producto a pedir' })
  @IsInt()
  @IsPositive()
  id_producto!: number;

  @ApiProperty({ example: 3, description: 'Cantidad de unidades de este producto' })
  @IsInt()
  @IsPositive()
  cantidad!: number;

  @ApiPropertyOptional({ example: 'Sin cebolla, por favor', description: 'Notas adicionales para este ítem' })
  @IsOptional()
  @IsString()
  notas?: string;
}
