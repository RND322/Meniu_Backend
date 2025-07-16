import { Body, Controller, Post, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterDto } from 'src/services/dto/register.dto';
import { RegisterService } from 'src/services/register.service';

@ApiTags('registro-clientes')
@Controller('registro-clientes')
export class RegisterController {
    constructor(private readonly registerService: RegisterService) { }

    //Endpoint POST: Registrar un cliente  
    @Post('registro')
    @ApiOperation({ summary: 'Registro completo de restaurante y usuario gerente' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('logo'))
    @ApiBody({
        description: 'Datos para registro de restaurante y usuario',
        schema: {
            type: 'object',
            required: [
                'nombre',
                'apellidos',
                'email',
                'password',
                'nombre_restaurante',
                'email_restaurante',
                'direccion',
                'telefono',
                'descripcion',
                'id_plan',
                'nombre_propietario_tarjeta',
                'numero_tarjeta',
                'cvv',
                'mes_expiracion',
                'anio_expiracion'
            ],
            properties: {
                nombre: { type: 'string', example: 'Juan' },
                apellidos: { type: 'string', example: 'Pérez' },
                email: { type: 'string', format: 'email', example: 'juan@restaurante.com' },
                password: { type: 'string', example: 'password123' },
                nombre_restaurante: { type: 'string', example: 'Mi Restaurante' },
                email_restaurante: { type: 'string', format: 'email', example: 'restaurante@example.com' },
                direccion: { type: 'string', example: 'Calle Principal 123' },
                telefono: { type: 'string', example: '5512345678' },
                descripcion: { type: 'string', example: 'Restaurante de comida tradicional' },
                id_plan: { type: 'number', example: 1 },
                nombre_propietario_tarjeta: { type: 'string', example: 'Juan Pérez' },
                numero_tarjeta: { type: 'string', example: '4111111111111111' },
                cvv: { type: 'string', example: '123' },
                mes_expiracion: { type: 'number', example: 12 },
                anio_expiracion: { type: 'number', example: 2025 },
                logo: {
                    type: 'string',
                    format: 'binary',
                    description: 'Logo del restaurante (opcional)'
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Registro exitoso',
        schema: {
            example: {
                success: true,
                message: 'Registro completado exitosamente',
                data: {
                    restauranteId: 1,
                    usuarioId: 1
                }
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos o faltantes'
    })
    async register(
        @Body() registerDto: RegisterDto,
        @UploadedFile() logo?: Express.Multer.File,
    ) {
        return this.registerService.completeRegistration(registerDto, logo);
    }
}