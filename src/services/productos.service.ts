import { Inject,Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from 'src/common/entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { IStorageService } from '../common/interfaces/storage.interface';
import { LocalStorageService } from '../common/services/local-storage.service';


@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    
    @Inject('IStorageService')
    private readonly storage: IStorageService,
  ) {}

  async create(productoData: CreateProductoDto, file: Express.Multer.File): Promise<Producto> {
    const imageUrl = await this.storage.uploadFile(file.buffer, file.originalname);

    const newProducto = this.productoRepository.create({
      ...productoData,
      imagen_url: imageUrl,
    });

    return await this.productoRepository.save(newProducto);
  }

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