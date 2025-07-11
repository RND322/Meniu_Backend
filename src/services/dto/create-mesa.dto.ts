import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMesaDto {
  @ApiProperty({
    example: 1,
    description: 'Número único de mesa dentro del restaurante',
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  numero_mesa!: number;

  @ApiProperty({
    example: 'Disponible',
    enum: ['Activa', 'Inactiva'],
    description: 'Estado inicial de la mesa',
  })
  @IsString()
  @IsNotEmpty()
  estado_mesa!: string;
}