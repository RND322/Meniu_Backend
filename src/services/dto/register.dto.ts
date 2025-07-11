import { IsNotEmpty, IsEmail, IsNumber, IsString, Length, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RegisterDto {
    @ApiProperty({ example: 'Juan' })
    @IsNotEmpty()
    @IsString()
    nombre!: string;

    @ApiProperty({ example: 'Pérez' })
    @IsNotEmpty()
    @IsString()
    apellidos!: string;

    @ApiProperty({ example: 'juan@restaurante.com' })
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    @Length(6, 50)
    password!: string;

    @ApiProperty({ example: 'Mi Restaurante' })
    @IsNotEmpty()
    @IsString()
    nombre_restaurante!: string;

    @ApiProperty({ example: 'restaurante@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email_restaurante!: string;

    @ApiProperty({ example: 'Calle Principal 123' })
    @IsNotEmpty()
    @IsString()
    direccion!: string;

    @ApiProperty({ example: '5512345678' })
    @IsNotEmpty()
    @IsString()
    telefono!: string;

    @ApiProperty({ example: 'Restaurante de comida tradicional' })
    @IsNotEmpty()
    @IsString()
    descripcion!: string;

    @ApiProperty({ example: 'Juan Pérez' })
    @IsNotEmpty()
    @IsString()
    nombre_propietario_tarjeta!: string;

    @ApiProperty({ example: '4111111111111111' })
    @IsNotEmpty()
    @IsString()
    @Length(13, 19)
    numero_tarjeta!: string;

    @ApiProperty({ example: '123' })
    @IsNotEmpty()
    @IsString()
    @Length(3, 4)
    cvv!: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    id_plan!: number;

    @ApiProperty({ example: 12 })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(1)
    @Max(12)
    mes_expiracion!: number;

    @ApiProperty({ example: 2025 })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(2023)
    anio_expiracion!: number;
}