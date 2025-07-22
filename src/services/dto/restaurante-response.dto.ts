import { ApiProperty } from '@nestjs/swagger';

export class RestauranteResponseDto {
  @ApiProperty({ example: 1, description: 'ID del restaurante' })
  id_restaurante!: number;

  @ApiProperty({ example: 'La Terraza Gourmet', description: 'Nombre del restaurante' })
  nombre!: string;

  @ApiProperty({ example: 'reservas@laterrazagourmet.com', description: 'Email de contacto' })
  email!: string;

  @ApiProperty({ example: 'Avenida del Mar 45, Playa Ejemplo', description: 'Dirección física' })
  direccion!: string;

  @ApiProperty({ example: '+34 600 123 456', description: 'Teléfono de contacto' })
  telefono!: string;

  @ApiProperty({ example: '/uploads/restaurantes/logo_1752210078835.png', description: 'URL del logo' })
  logo_url!: string;

  @ApiProperty({ example: 'Restaurante de comida fusión con vistas al mar.', description: 'Descripción detallada' })
  descripcion!: string;

  @ApiProperty({ example: true, description: 'Si el restaurante está activo o no' })
  activo!: boolean;

  @ApiProperty({ example: '2025-04-18T01:31:21.000Z', description: 'Fecha de creación' })
  fechaCreacion!: Date;
}
