import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, UseInterceptors, UploadedFile, UseGuards, Req, BadRequestException, HttpCode } from '@nestjs/common';
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
import { UpdateProductoTextDto } from 'src/services/dto/update-producto-text.dto';
import { CreateProductoTextDto } from 'src/services/dto/create-producto-text.dto';

@ApiTags('productos')
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

  // Endpoint GET :id - Obtener productos de un restaurante uso para Gerentes y Administradores
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Gerente', 'Administrador')
  @Get('restaurante/obtener-gestion')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Todos los productos (Gestión) - Uso para Gerente, Administrador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista completa de productos del restaurante',
    type: [Producto],
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Sin permiso o token inválido' })
  async findAllByRestauranteAdmin(
    @Req() req: AuthRequest,
  ): Promise<Producto[]> {
    return this.productosService.findAllByRestauranteAdmin(
      req.user.restaurante_id,
    );
  }

  // Endpoint GET :id - Obtener productos de un restaurante
  @Get('restaurante/:id')
  @ApiOperation({ summary: 'Productos activos por restaurante' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Productos activos', type: [Producto] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Restaurante no encontrado' })
  async findByRestaurante(
    @Param('id') restauranteId: number,
  ): Promise<Producto[]> {
    return this.productosService.findByRestaurante(restauranteId);
  }

  // Endpoint GET :id - Obtener un producto por ID que esten activos
  @Get('obtener/:id')
  @ApiOperation({ summary: 'Obtener producto activo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 3 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto activo encontrado',
    type: Producto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado o no activo',
  })
  async findOneActive(
    @Param('id') id: number,
  ): Promise<Producto> {
    return this.productosService.findOneActive(id);
  }

  // Endpoint GET :id - Obtener un producto por ID uso para Gerentes y Administradores.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Gerente', 'Administrador')
  @Get('obtener/gestion/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'Obtener producto por ID (Gestion) - Uso para Gerente, Administrador',
  })
  @ApiParam({ name: 'id', type: Number, example: 3 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto encontrado en tu restaurante',
    type: Producto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido o sin permisos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no existe o no pertenece a tu restaurante',
  })
  async findOneByIdAdmin(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ): Promise<Producto> {
    const restauranteId = req.user.restaurante_id;
    return this.productosService.findOneByIdAdmin(id, restauranteId);
  }

  // Endpoint POST - Crear un producto con imagen
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Gerente')
  @Post('crear-producto')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({
    summary: 'Crear un nuevo producto con imagen (Gestion) - Uso para Gerente, Administrador',
    description: `⚠️ Importante: Solo para uso rol Gerente o Administrador.
                 Swagger autocompleta todos los campos con valores de ejemplo. 
                 Si solo deseas modificar uno, borra los demás antes de enviar.` })
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
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({
    summary: 'Actualizar un producto por ID (Gestion) - Uso para Gerente, Administrador',
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

  /*MODIFICACION DE CIERTOS METODOS */

  //Endpoint POST - Crear un producto con link o texto como imagen
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Gerente', 'Administrador')
  @ApiBearerAuth('JWT-auth')
  @Post('crear-producto-ln')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear producto con imagen como link o texto (Gestion) - Uso para Gerente, Administrador',
    description: 'Este endpoint permite crear un producto con texto en el campo imagen, todos los campos son obligatorios',
  })
  @ApiBody({ type: CreateProductoTextDto })
  @ApiResponse({ status: 201, description: 'Producto creado', type: Producto })
  async createText(
    @Body() dto: CreateProductoTextDto,
    @Req() req: AuthRequest,
  ): Promise<Producto> {
    return this.productosService.createWithImageText(dto, req.user.restaurante_id);
  }

  //Endpoint PUT - Modificar un producto con link o texto como imagen
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Gerente', 'Administrador')
  @ApiBearerAuth('JWT-auth')
  @Put('actualizar-productoln/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOperation({
    summary: 'Actualizar producto con imagen como link o texto (Gestion) - Uso para Gerente, Administrador',
    description: 'Este endpoint permite modificar un producto con texto en el campo imagen, todos los campos son opcionales',
  })
  @ApiBody({ type: UpdateProductoTextDto })
  @ApiResponse({ status: 200, description: 'Producto actualizado', type: Producto })
  async updateText(
    @Param('id') id: number,
    @Body() dto: UpdateProductoTextDto,
    @Req() req: AuthRequest,
  ): Promise<Producto> {
    return this.productosService.updateWithImageText(
      id,
      dto,
      req.user.restaurante_id,
    );
  }
}