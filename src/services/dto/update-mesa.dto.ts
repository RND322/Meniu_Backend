import { IsNumber, IsString, IsOptional} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateMesaDto {
   @ApiProperty({
      example: 1,
      description: 'Número único de mesa dentro del restaurante',
    })
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @IsOptional()
    numero_mesa!: number;

  @ApiPropertyOptional({ 
    example: 'Ocupada', 
    enum: ['Activa', 'Inactiva'],
    description: 'Nuevo estado de la mesa'
  })
  @IsString()
  @IsOptional()
  estado_mesa?: string;
}