import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { PersonasService } from 'src/services/personas.service';
import { CreatePersonaDto } from 'src/services/dto/create-persona.dto';

@ApiTags('personas')
@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) { }

  // Endpoint POST: Registrar a las personas
  @Post('registrar')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar una persona con usuario, rol y email',
    description: "Crea un usuario con nombre de usuario, contraseña y lo enlaza con una persona y email."
  })
  @ApiBody({ type: CreatePersonaDto })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        nombre: 'Juan',
        apellidos: 'Pérez',
        email: 'juan@mail.com',
        nombre_usuario: 'JuanPérez489',
        password: 'Juan!',
      },
    },
  })
  async registrar(@Body() dto: CreatePersonaDto) {
    return this.personasService.crearPersonaConUsuario(dto);
  }
}
