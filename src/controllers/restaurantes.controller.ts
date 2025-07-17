import { Controller, Put, Param, Body, UseGuards, UploadedFile, UseInterceptors, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RestaurantesService } from 'src/services/restaurantes.service';
import { UpdateRestauranteDto } from 'src/services/dto/update-restaurante.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import { Restaurante } from 'src/common/entities/restaurante.entity';
import { UpdateRestauranteTextDto } from 'src/services/dto/update-restaurante-text.dto';

@ApiTags('restaurantes')
@ApiBearerAuth('JWT-auth')
@Controller('restaurantes')
export class RestaurantesController {
    constructor(
        private readonly restaurantesService: RestaurantesService,
    ) { }

    //Endpoint PUT: Actualizacion de datos de un restaurante (Gestion) - Uso Gerente/Administrador
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Gerente', 'Administrador')
    @Put('actualizar/:id')
    @UseInterceptors(FileInterceptor('logo'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: 'Actualizar datos de un restaurante (Gestion) - Uso para Gerente, Administrador',
        description: `⚠️ Importante: Solo para uso rol Gerente o Administrador.
                  Swagger autocompleta todos los campos con valores de ejemplo. 
                  Si solo deseas modificar uno, borra los demás antes de enviar.`
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string', example: 'Mi Nuevo Nombre' },
                email: { type: 'string', format: 'email', example: 'nuevousuario@rest.com' },
                direccion: { type: 'string', example: 'Av. Actualizada 123' },
                telefono: { type: 'string', example: '+34 600 111 222' },
                descripcion: { type: 'string', example: 'Nueva descripción' },
                logo: { type: 'string', format: 'binary', description: 'Logo opcional' },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Restaurante actualizado',
        type: Restaurante,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Restaurante no encontrado',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Sin permisos o intentando modificar otro restaurante',
    })
    async update(
        @Body() dto: UpdateRestauranteDto,
        @Req() req: AuthRequest,
        @UploadedFile() logo?: Express.Multer.File,
    ): Promise<Restaurante> {
        const restauranteId = req.user.restaurante_id;
        return this.restaurantesService.updateRestaurant(
            restauranteId, 
            dto,
            logo,
            restauranteId, 
        );
    }

    /*MODIFICACION DE METODOS */

    //Endpoint PUT: Actualizacion de datos de un restaurante (Gestion) - Uso Gerente/Administrador
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Gerente', 'Administrador')
    @Put('actualizar-ln/:id')
    @ApiOperation({
        summary: 'Actualizar datos de restaurante con el logo como link o texto ',
        description: 'Este endpoint permite modificar un rextaurante con texto en el campo imagen, todos los campos son opcionales',
    })
    @ApiBody({ type: UpdateRestauranteTextDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Restaurante actualizado',
        type: Restaurante,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Restaurante no encontrado',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Sin permisos o tratando de modificar otro restaurante',
    })
    async updateText(
        @Body() dto: UpdateRestauranteTextDto,
        @Req() req: AuthRequest,
    ): Promise<Restaurante> {
        const restauranteId = req.user.restaurante_id;
        return this.restaurantesService.updateRestaurantText(
            restauranteId,
            dto,
            restauranteId,
        );
    }
}
