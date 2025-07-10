import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from 'src/common/entities/producto.entity';
import { SubcategoriaProducto } from 'src/common/entities/subcategoria-producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { IStorageService } from '../common/interfaces/storage.interface';
import { LocalStorageService } from '../common/services/local-storage.service';


@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @Inject('IStorageService')
    private readonly storage: IStorageService,
  ) { }

  //Obtencion de todos
  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
  }

  //Busqueda
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

  /*
  //Creacion
  async create(productoData: CreateProductoDto, file: Express.Multer.File): Promise<Producto> {
    const imageUrl = await this.storage.uploadFile(file.buffer, file.originalname);

    const newProducto = this.productoRepository.create({
      ...productoData,
      imagen_url: imageUrl,
    });

    return await this.productoRepository.save(newProducto);
  }

  //Actualizacion
  async update(id: number, dto: UpdateProductoDto, file?: Express.Multer.File): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: id },
      relations: ['subcategoria'],
    });

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // Si se subió una imagen
    if (file) {
      const imagenUrl = await this.storage.uploadFile(file.buffer, file.originalname);
      producto.imagen_url = imagenUrl;
    }

    // Asignaciones seguras
    if (dto.nombre && dto.nombre.trim() !== '') {
      producto.nombre = dto.nombre;
    }

    if (dto.descripcion && dto.descripcion.trim() !== '') {
      producto.descripcion = dto.descripcion;
    }

    if (dto.precio !== undefined && !isNaN(dto.precio) && dto.precio > 0) {
      producto.precio = dto.precio;
    }

    if (dto.activo === 0 || dto.activo === 1) {
      producto.activo = dto.activo;
    }

    if (
      dto.id_subcategoria !== undefined &&
      dto.id_subcategoria !== null &&
      Number.isInteger(dto.id_subcategoria) &&
      dto.id_subcategoria > 0
    ) {
      producto.subcategoria = { id_subcategoria: dto.id_subcategoria } as SubcategoriaProducto;
    }

    return this.productoRepository.save(producto);
  }
  */

  async create(
    dto: CreateProductoDto,
    file: Express.Multer.File,
  ): Promise<Producto> {
    // -- check: sólo existe dto.id_restaurante si viene del controller --
    const imageUrl = await this.storage.uploadFile(
      file.buffer,
      file.originalname,
    );

    const newProducto = this.productoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      imagen_url: imageUrl,
      // vinculamos la relación con restaurante y subcategoría:
      restaurante: { id_restaurante: dto.id_restaurante } as any,
      subcategoria: { id_subcategoria: dto.id_subcategoria } as SubcategoriaProducto,
    });

    return this.productoRepository.save(newProducto);
  }


  async update(
    id: number,
    dto: UpdateProductoDto,
    file: Express.Multer.File | undefined,
    restauranteId: number,
  ): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: id },
      relations: ['subcategoria', 'restaurante'],
    });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Verificar que el producto sea del restaurante correcto
    if (producto.restaurante.id_restaurante !== restauranteId) {
      throw new UnauthorizedException(
        'No puedes modificar un producto de otro restaurante',
      );
    }

    // Si hay nueva imagen…
    if (file) {
      producto.imagen_url = await this.storage.uploadFile(
        file.buffer,
        file.originalname,
      );
    }

    // …y resto de campos
    if (dto.nombre) producto.nombre = dto.nombre;
    if (dto.descripcion) producto.descripcion = dto.descripcion;
    if (dto.precio !== undefined) producto.precio = dto.precio;
    if (dto.activo === 0 || dto.activo === 1)
      producto.activo = dto.activo;
    if (dto.id_subcategoria)
      producto.subcategoria = {
        id_subcategoria: dto.id_subcategoria,
      } as SubcategoriaProducto;

    return this.productoRepository.save(producto);
  }
}