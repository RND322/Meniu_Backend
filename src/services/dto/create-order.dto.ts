import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsInt, IsPositive, IsOptional, IsString } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ example: 5, description: 'ID de la mesa donde se hace la orden' })
  @IsInt()
  @IsPositive()
  id_mesa!: number;

  @ApiProperty({ example: 2, description: 'ID del restaurante donde se crea la orden' })
  @IsInt()
  @IsPositive()
  id_restaurante!: number;

  @ApiPropertyOptional({ example: 'Traer salsa extra', description: 'Notas generales de la orden' })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Listado de ítems incluidos en la orden'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
