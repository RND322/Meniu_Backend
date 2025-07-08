import { Controller, Put, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateUsuarioDto } from 'src/services/dto/update-usuario.dto';
import { UsuariosService } from 'src/services/usuarios.service';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    // Endpoint GET: Obtener todos los usuarios
    @Get()
    @ApiOperation({ summary: 'Obtener todos los usuarios con sus datos asociados' })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios',
        schema: {
            example: [
                {
                    id_usuario: 1,
                    nombreUsuario: 'AnaGarcia423',
                    activo: 1,
                    nombre: 'Ana',
                    apellidos: 'García',
                    email: 'ana@mail.com',
                    rol: 'Cajero',
                },
                {
                    id_usuario: 2,
                    nombreUsuario: 'LuisHernandez874',
                    activo: 0,
                    nombre: 'Luis',
                    apellidos: 'Hernández',
                    email: 'luis@mail.com',
                    rol: 'Administrador',
                },
            ],
        },
    })
    async obtenerTodos() {
        return this.usuariosService.obtenerTodosDetalle();
    }

    // Endpoint PUT: Actualizar datos de un usuario
    @Put('actualizar/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar datos de un usuario excepto nombreUsuario' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBody({ type: UpdateUsuarioDto })
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente' })
    async actualizarUsuario(@Param('id') id: number, @Body() dto: UpdateUsuarioDto) {
        return this.usuariosService.actualizarUsuario(id, dto);
    }

    // Endpoint GET: Obtener datos de un usuario
    @Get('obtener/:id')
    @ApiOperation({ summary: 'Obtener datos detallados de un usuario por ID' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({
        status: 200,
        description: 'Datos del usuario',
        schema: {
            example: {
                id_usuario: 5,
                nombreUsuario: 'CarlosLopez298',
                activo: 1,
                nombre: 'Carlos',
                apellidos: 'López',
                email: 'carlos@correo.com',
                rol: 'Administrador'
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async obtenerPorId(@Param('id') id: number) {
        return this.usuariosService.obtenerDetalleUsuario(id);
    }
}