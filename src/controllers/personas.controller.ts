import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { PersonasService } from 'src/services/personas.service';
import { CreatePersonaDto } from 'src/services/dto/create-persona.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('personas')
@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) { }

  // Endpoint POST: Registrar a las personas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Gerente', 'Administrador')
  @Post('registrar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar una persona con usuario, rol y email (Gestion) - Uso para Gerente, Administrador',
    description:
      "Crea un usuario con nombre de usuario, contraseña y lo enlaza con una persona y email. Sólo Gerente/Admin.",
  })
  @ApiBody({ type: CreatePersonaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      example: {
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: 'juan@mail.com',
        nombre_usuario: 'JuanPérez489',
        password: 'Juan!1234',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido o sin permisos',
  })
  async registrar(@Body() dto: CreatePersonaDto) {
    return this.personasService.crearPersonaConUsuario(dto);
  }
}
