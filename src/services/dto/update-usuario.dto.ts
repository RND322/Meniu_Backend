import { IsOptional, IsString, IsEmail, IsInt, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ example: 'Carlos!8293' })
  @IsOptional()
  @Matches(/^\w+[\?\.,!:;]{1}\d{4}$/, {
    message: 'La contraseña debe seguir el formato: palabra + símbolo + 4 números (ej: Alex!1234)',
  })
  password?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @IsOptional()
  activo?: number;

  @ApiPropertyOptional({ example: 'Carlos' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Hernández' })
  @IsString()
  @IsOptional()
  apellidos?: string;

  @ApiPropertyOptional({ example: 'carlos@mail.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @IsOptional()
  id_rol?: number;
} 