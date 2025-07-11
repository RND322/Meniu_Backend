import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, UseInterceptors, UploadedFile, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRequest } from 'src/common/interfaces/auth-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Producto } from 'src/common/entities/producto.entity';
import { ProductosService } from 'src/services/productos.service';
import { CreateProductoDto } from 'src/services/dto/create-producto.dto';
import { UpdateProductoDto } from 'src/services/dto/update-producto.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Request } from 'express';

@ApiTags('productos')
@ApiBearerAuth('JWT-auth')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }
  
  /*
  // Endpoint GET: Obtener todos los productos
  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de productos',
    type: [Producto],
  })
  async findAll(): Promise<Producto[]> {
    return this.productosService.findAll();
  }
*/

  // Endpoint GET: Obtener todos los productos de un restaurante
  @Get('restaurante/:id')
  @ApiOperation({ summary: 'Obtener productos por ID de restaurante' })
  @ApiParam({
    name: 'id',
    description: 'ID del restaurante',
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de productos del restaurante',
    type: [Producto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurante no encontrado'
  })
  async findByRestaurante(@Param('id') restauranteId: number): Promise<Producto[]> {
    return this.productosService.findByRestaurante(restauranteId);
  }


  // Endpoint GET :id - Obtener un producto por ID
  @Get('obtener/:id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del producto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto encontrado',
    type: Producto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado',
  })
  async findOne(@Param('id') id: number): Promise<Producto> {
    return this.productosService.findOne(id);
  }

  // Endpoint POST - Crear un producto con imagen
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Gerente')
  @Post('crear-producto')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({
    summary: 'Crear un nuevo producto con imagen',
    description: `⚠️ Importante: Solo para uso rol Gerente o Administrador.
                 Swagger autocompleta todos los campos con valores de ejemplo. 
                 Si solo deseas modificar uno, borra los demás antes de enviar.` })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Pollo Masala' },
        descripcion: { type: 'string', example: 'Delicioso pollo al estilo hindú' },
        precio: { type: 'number', example: 600.5 },
        id_restaurante: { type: 'number', example: 1 },
        id_subcategoria: { type: 'number', example: 2 },
        activo: { type: 'number', example: 1 },
        imagen: {
          type: 'string',
          format: 'binary',
        },
      },
      required: [
        'nombre',
        'descripcion',
        'precio',
        'id_restaurante',
        'id_subcategoria',
        'imagen',
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Producto creado correctamente',
    type: Producto,
  })
  async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateProductoDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Producto> {
    if (!file) {
      throw new BadRequestException('Debes enviar una imagen para el producto');
    }
    // Forzamos el restaurante desde el JWT
    dto.id_restaurante = req.user.restaurante_id;
    return this.productosService.create(dto, file);
  }

  // Endpoint PUT - Modificar los datos de un producto
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Gerente')
  @Put('actualizar/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({
    summary: 'Actualizar un producto por ID (excepto el restaurante)',
    description: `⚠️ Importante: Solo para uso rol Gerente o Administrador.
                  Swagger autocompleta todos los campos con valores de ejemplo. 
                  Si solo deseas modificar uno, borra los demás antes de enviar.` })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del producto a actualizar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Nuevo nombre' },
        descripcion: { type: 'string', example: 'Descripción actualizada' },
        precio: { type: 'number', example: 120.5 },
        activo: { type: 'number', example: 1 },
        id_subcategoria: { type: 'number', example: 3 },
        imagen: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado correctamente',
    type: Producto,
  })
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: number,
    @Body() dto: UpdateProductoDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Producto> {
    // file es opcional, el servicio lo maneja
    return this.productosService.update(
      id,
      dto,
      file,
      req.user.restaurante_id,
    );
  }

}