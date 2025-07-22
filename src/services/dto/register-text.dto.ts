// src/services/dto/register-text.dto.ts
import { IsNotEmpty, IsEmail, IsNumber, IsString, Length, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RegisterDto } from './register.dto';

export class RegisterTextDto extends RegisterDto {
    @ApiPropertyOptional({
        example: '/uploads/restaurantes/logo_1627389123456.png',
        description: 'URL o texto del logo (opcional)',
    })
    @IsOptional()
    @IsString()
    logoUrl?: string;
}
