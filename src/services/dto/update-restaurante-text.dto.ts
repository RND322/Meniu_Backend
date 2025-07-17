import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsEmail } from 'class-validator';

export class UpdateRestauranteTextDto {
    @ApiPropertyOptional({ example: 'Mi Nuevo Restaurante', description: 'Nuevo nombre' })
    @IsOptional() @IsString() @Length(1, 100)
    nombre?: string;

    @ApiPropertyOptional({ example: 'email@nuevo.com', description: 'Nuevo email' })
    @IsOptional() @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'Av. Siempre Viva 742', description: 'Nueva dirección' })
    @IsOptional() @IsString()
    direccion?: string;

    @ApiPropertyOptional({ example: '+34 600 000 000', description: 'Nuevo teléfono' })
    @IsOptional() @IsString()
    telefono?: string;

    @ApiPropertyOptional({ example: 'Restaurante con cocina fusión', description: 'Nueva descripción' })
    @IsOptional() @IsString()
    descripcion?: string;

    @ApiPropertyOptional({
        example: '/uploads/restaurantes/logo_1752210078835.png',
        description: 'URL o texto del logo',
    })
    @IsOptional() @IsString()
    logoUrl?: string;
}
