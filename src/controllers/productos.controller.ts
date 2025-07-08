import { Controller, Get, Post, Put, Delete, Param, Body,HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Producto } from 'src/common/entities/producto.entity';
import { ProductosService } from 'src/services/productos.service';
import { CreateProductoDto } from 'src/services/dto/create-producto.dto';
import { UpdateProductoDto } from 'src/services/dto/update-producto.dto';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

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

  // Endpoint GET :id - Obtener un producto por ID
  @Get(':id')
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
  @Post('crear-producto')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({ summary: 'Crear un nuevo producto con imagen',
                  description:`⚠️ Importante: Swagger autocompleta todos los campos con valores de ejemplo. 
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
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Producto> {
    return this.productosService.create(createProductoDto, file);
  }

  // Endpoint PUT - Modificar los datos de un producto
  @Put('actualizar/:id')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({ summary: 'Actualizar un producto por ID (excepto el restaurante)', 
                  description:`⚠️ Importante: Swagger autocompleta todos los campos con valores de ejemplo. 
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
    @Param('id') id: number,
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Producto> {
    return this.productosService.update(id, updateProductoDto, file);
}
} 