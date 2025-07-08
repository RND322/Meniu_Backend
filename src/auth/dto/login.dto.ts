import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

  @ApiProperty({
    example: 'admin123',
    description: 'Nombre de usuario para iniciar sesión',
  })
  @IsString()
  nombre_usuario!: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario',
  })
  @IsString()
  password!: string;
}
