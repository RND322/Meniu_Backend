import { Controller, Get, Param } from '@nestjs/common';
import { ProductosService } from 'src/services/productos.service';
import { Producto } from 'src/common/entities/producto.entity';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll(): Promise<Producto[]> {
    return this.productosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Producto> {
    return this.productosService.findOne(id);
  }
}