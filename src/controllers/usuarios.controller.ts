import { Controller, Put, Get, Param, Body, HttpCode, HttpStatus, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUsuarioDto } from 'src/services/dto/update-usuario.dto';
import { UsuariosService } from 'src/services/usuarios.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('usuarios')
@ApiBearerAuth('JWT-auth')
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    // Endpoint GET: Obtener todos los usuarios de un restaurante
    @Get('todos')
    @Roles('Administrador', 'Gerente')
    @ApiOperation({ summary: 'Obtener todos los usuarios de un restaurante (Gestion) - Uso para Gerente, Administrador' })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios del restaurante',
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
    async obtenerTodos(@Request() req) {
        //console.log('Usuario completo:', req.user);
        const idRestaurante = req.user?.restaurante_id; // Cambio de clave aquí
        if (!idRestaurante) {
            throw new UnauthorizedException('Restaurante no asignado');
        }
        return this.usuariosService.obtenerTodosDetalle(idRestaurante); //Envía el ID directamente
    }

    // Endpoint PUT: Actualizar datos de un usuario
    @Put('actualizar/:id')
    @Roles('Administrador', 'Gerente')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar datos de un usuario (Gestion) - Uso para Gerente, Administrador' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBody({ type: UpdateUsuarioDto })
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente' })
    async actualizarUsuario(@Param('id') id: number, @Body() dto: UpdateUsuarioDto) {
        return this.usuariosService.actualizarUsuario(id, dto);
    }

    // Endpoint GET: Obtener datos de un usuario
    @Get('obtener/:id')
    @Roles('Administrador', 'Gerente')
    @ApiOperation({ summary: 'Obtener datos detallados de un usuario por ID (Gestion) - Uso para Gerente, Administrador' })
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