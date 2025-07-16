import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ example: 101, description: 'ID interno del ítem de orden' })
  id_orden_item!: number;

  @ApiProperty({ example: 42, description: 'ID del producto' })
  id_producto!: number;

  @ApiProperty({ example: 'Hamburguesa doble', description: 'Nombre del producto' })
  nombre_producto!: string;

  @ApiProperty({ example: 3, description: 'Cantidad pedida' })
  cantidad!: number;

  @ApiProperty({ example: 120.5, description: 'Precio unitario al momento de la orden' })
  precio_unitario!: number;

  @ApiPropertyOptional({ example: 'Sin cebolla', description: 'Notas específicas del ítem' })
  notas?: string;
}
