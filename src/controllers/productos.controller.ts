/*
import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Producto } from 'src/common/entities/producto.entity';
import { ProductosService } from 'src/services/productos.service';

@ApiTags('productos') // Agrupa los endpoints bajo "productos"
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
    type: [Producto],
  })
  async findAll(): Promise<Producto[]> {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID del producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: Producto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  async findOne(@Param('id') id: number): Promise<Producto> {
    return this.productosService.findOne(id);
  }
}
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { Producto } from 'src/common/entities/producto.entity';
import { ProductosService } from 'src/services/productos.service';
import { CreateProductoDto } from 'src/services/dto/create-producto.dto';

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
  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBody({ type: CreateProductoDto })
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
} 