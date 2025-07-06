import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from 'src/common/entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
        where: { id_producto: id },
        relations: ['subcategoria', 'subcategoria.categoria'],
    });

    if (!producto) {
        throw new Error('Producto no encontrado'); // o lanza una excepción
    }

    return producto;
  }
}