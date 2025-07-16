import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderItemResponseDto } from './order-item-response.dto';

class RestauranteBrief {
  @ApiProperty({ example: 2, description: 'ID del restaurante' })
  id_restaurante!: number;

  @ApiProperty({ example: 'La Terraza Gourmet', description: 'Nombre del restaurante' })
  nombre!: string;
}

class MesaBrief {
  @ApiProperty({ example: 5, description: 'ID de la mesa' })
  id_mesa!: number;

  @ApiProperty({ example: 12, description: 'Número de mesa visible al cliente' })
  numero_mesa!: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: 123, description: 'ID asignado a la orden' })
  id_orden!: number;

  @ApiProperty({ type: RestauranteBrief, description: 'Restaurante que crea la orden' })
  restaurante!: RestauranteBrief;

  @ApiProperty({ type: MesaBrief, description: 'Mesa asignada a la orden' })
  mesa!: MesaBrief;

  @ApiProperty({ example: 'PENDIENTE', description: 'Estado actual de la orden' })
  estado!: string;

  @ApiProperty({ example: '2025-07-14T17:20:30.000Z', description: 'Fecha y hora de creación' })
  fecha!: Date;

  @ApiProperty({ example: '17:20:30', description: 'Hora de confirmación' })
  hora_confirmacion!: string;

  @ApiPropertyOptional({ example: '17:25:00', description: 'Hora en que la orden quedó lista' })
  hora_lista?: string;

  @ApiPropertyOptional({ example: '17:30:10', description: 'Hora en que la orden fue entregada' })
  hora_entregada?: string;

  @ApiProperty({ example: 361.5, description: 'Subtotal antes de impuestos' })
  subtotal!: number;

  @ApiProperty({ example: 54.23, description: 'Impuestos aplicados' })
  impuestos!: number;

  @ApiProperty({ example: 415.73, description: 'Total (subtotal + impuestos)' })
  total!: number;

  @ApiProperty({ example: false, description: 'Indicador de solicitud de pago' })
  solicitud_pago!: boolean;

  @ApiPropertyOptional({ example: 'Traer salsa extra', description: 'Notas generales de la orden' })
  notas?: string;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'Detalle de cada ítem pedido' })
  items!: OrderItemResponseDto[];
}
