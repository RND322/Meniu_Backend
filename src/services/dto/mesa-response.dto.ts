import { ApiProperty } from '@nestjs/swagger';

class RestauranteBriefDto {
  @ApiProperty({ example: 1, description: 'ID del restaurante' })
  id_restaurante!: number;

  @ApiProperty({ example: 'La Terraza Gourmet', description: 'Nombre del restaurante' })
  nombre!: string;
}

export class MesaResponseDto {
  @ApiProperty({ example: 5, description: 'ID de la mesa' })
  id_mesa!: number;

  @ApiProperty({ example: 3, description: 'Número de mesa visible al cliente' })
  numero_mesa!: number;

  @ApiProperty({ example: '/uploads/mesas/qr_1752141454857.png', description: 'URL del código QR' })
  qr_code!: string;

  @ApiProperty({ example: 'Disponible', description: 'Estado actual de la mesa' })
  estado_mesa!: string;

  @ApiProperty({ type: RestauranteBriefDto, description: 'Información básica del restaurante al que pertenece' })
  restaurante!: RestauranteBriefDto;
}
