import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMesaTextDto {
    @ApiProperty({ example: 1, description: 'Número único de mesa en el restaurante' })
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    numero_mesa!: number;

    @ApiProperty({ example: 'Activa', enum: ['Activa', 'Inactiva'] })
    @IsString()
    estado_mesa!: string;

    @ApiProperty({
        example: '/uploads/mesas/qr_123456.png',
        description: 'URL o texto del código QR',
    })
    @IsString()
    qr_code!: string;
}
