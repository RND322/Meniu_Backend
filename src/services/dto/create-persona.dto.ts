import { IsEmail, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonaDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  nombre!: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  apellidos!: string;

  @ApiProperty({ example: 'juan@mail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  id_rol!: number;

  @ApiProperty({ example: 1, description: 'ID del restaurante al que pertenece el usuario' })
  @IsInt()
  id_restaurante!: number;
}
