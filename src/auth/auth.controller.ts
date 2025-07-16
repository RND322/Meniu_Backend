import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //Endpoint POST: Login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con nombre de usuario y contraseña' })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales de acceso',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        access_token: 'jwt_token_generado',
        user: {
          id_usuario: 1,
          nombreUsuario: 'admin123',
          rol: 'Administrador',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  //Endpoint POST: Logout (solo es demostracion como tal)
  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sesión cerrada exitosamente',
    schema: {
      example: {
        message: 'Sesión cerrada exitosamente',
      },
    },
  })
  async logout() {
    return { message: 'Sesión cerrada exitosamente' };
  }

}
