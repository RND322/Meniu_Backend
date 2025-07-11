import { Controller, Post, Put, Get, Body, UploadedFile, UseInterceptors, UseGuards, Req, HttpStatus, BadRequestException, NotFoundException, ForbiddenException, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Mesa } from '../common/entities/mesa.entity';
import { MesasService } from '../services/mesas.service';
import { CreateMesaDto } from '../services/dto/create-mesa.dto';
import { AuthRequest } from '../common/interfaces/auth-request.interface';
import { UpdateMesaDto } from 'src/services/dto/update-mesa.dto';

@ApiTags('mesas')
@ApiBearerAuth('JWT-auth')
@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) { }

  // Endpoint POST: Crear una mesa
  @Post('crear-mesa')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Gerente')
  @ApiOperation({ summary: 'Crear nueva mesa para el restaurante del usuario' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('qr_image'))
  @ApiBody({
    description: 'Datos para crear nueva mesa',
    schema: {
      type: 'object',
      properties: {
        numero_mesa: {
          type: 'number',
          example: 1,
          description: 'Número único de mesa en el restaurante',
        },
        estado_mesa: {
          type: 'string',
          example: 'Disponible',
          enum: ['Activa', 'Inactiva'],
        },
        qr_image: {
          type: 'string',
          format: 'binary',
          description: 'Imagen del código QR para la mesa',
        },
      },
      required: ['numero_mesa', 'estado_mesa', 'qr_image'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Mesa creada exitosamente',
    type: Mesa,
  })
  async crearMesa(
    @Req() req: AuthRequest,
    @Body() createMesaDto: CreateMesaDto,
    @UploadedFile() qrImage: Express.Multer.File,
  ): Promise<Mesa> {
    if (!qrImage) {
      throw new BadRequestException('Debe proporcionar una imagen QR para la mesa');
    }

    const restauranteId = req.user.restaurante_id;

    // Verificar si el número de mesa ya existe
    const mesaExistente = await this.mesasService.verificarMesaExistente(
      createMesaDto.numero_mesa,
      restauranteId,
    );

    if (mesaExistente) {
      throw new BadRequestException(
        `El número de mesa ${createMesaDto.numero_mesa} ya existe en este restaurante`,
      );
    }

    // Subir imagen QR usando el servicio de almacenamiento
    const qrCodeUrl = await this.mesasService.subirImagenQR(qrImage);

    return this.mesasService.crearMesa({
      numero_mesa: createMesaDto.numero_mesa,
      estado_mesa: createMesaDto.estado_mesa,
      qr_code: qrCodeUrl,
      id_restaurante: restauranteId // Esto debe venir del token (req.user.restaurante_id)
    });
  }

  // Endpoint PUT: Actualizar detalles de una mesa
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Gerente')
  @ApiOperation({ summary: 'Actualizar una mesa' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('qr_image'))
  @ApiBody({
    description: 'Datos para actualizar la mesa',
    schema: {
      type: 'object',
      properties: {
        numero_mesa: {
          type: 'number',
          example: 2,
          nullable: true
        },
        estado_mesa: {
          type: 'string',
          example: 'Activa',
          enum: ['Activa', 'Inactiva'],
          nullable: true
        },
        qr_image: {
          type: 'string',
          format: 'binary',
          description: 'Nuevo código QR',
          nullable: true
        }
      }
    }
  })
  async actualizarMesa(
    @Param('id') idMesa: number,
    @Req() req: AuthRequest,
    @Body() updateDto: UpdateMesaDto,
    @UploadedFile() qrImage?: Express.Multer.File,
  ): Promise<Mesa> {
    const restauranteId = req.user.restaurante_id;

    const mesa = await this.mesasService.obtenerMesaConRestaurante(idMesa);
    if (!mesa) {
      throw new NotFoundException(`Mesa con ID ${idMesa} no encontrada`);
    }

    if (!mesa.restaurante || mesa.restaurante.id_restaurante !== restauranteId) {
      throw new ForbiddenException('No tienes permisos para esta mesa');
    }

    const datosActualizados: any = {};

    if (updateDto.numero_mesa !== undefined) {
      if (updateDto.numero_mesa !== mesa.numero_mesa) {
        const existe = await this.mesasService.verificarMesaExistente(
          updateDto.numero_mesa,
          restauranteId
        );
        if (existe) {
          throw new BadRequestException('El número de mesa ya existe');
        }
      }
      datosActualizados.numero_mesa = updateDto.numero_mesa;
    }

    if (updateDto.estado_mesa !== undefined) {
      datosActualizados.estado_mesa = updateDto.estado_mesa;
    }

    if (qrImage) {
      datosActualizados.qr_code = await this.mesasService.subirImagenQR(qrImage);
    }

    return this.mesasService.actualizarMesa(idMesa, datosActualizados);
  }

  // Endpoint GET: Obtener todas las mesas de un restaurante con sus detalles
  @Get('restaurante-mesas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Gerente')
  @ApiOperation({ summary: 'Obtener todas las mesas del restaurante del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de mesas del restaurante',
    type: [Mesa],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuario no autorizado',
  })
  async obtenerMesasDelRestaurante(
    @Req() req: AuthRequest,
  ): Promise<Mesa[]> {
    const restauranteId = req.user.restaurante_id;
    return this.mesasService.obtenerMesasPorRestaurante(restauranteId);
  }
}