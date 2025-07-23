import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from 'src/common/entities/producto.entity';
import { SubcategoriaProducto } from 'src/common/entities/subcategoria-producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { IStorageService } from '../common/interfaces/storage.interface';
import { LocalStorageService } from '../common/services/local-storage.service';
import { Restaurante } from 'src/common/entities/restaurante.entity';
import { UpdateProductoTextDto } from './dto/update-producto-text.dto';
import { CreateProductoTextDto } from './dto/create-producto-text.dto';
import { ProductoComplemento } from 'src/common/entities/producto-complemento.entity';
import { CreateComplementoDto } from './dto/create-complemento.dto';


@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Restaurante)
    private restauranteRepository: Repository<Restaurante>,

    @InjectRepository(ProductoComplemento)
    private readonly complementoRepo: Repository<ProductoComplemento>,

    @Inject('IStorageService')
    private readonly storage: IStorageService,
  ) { }

  /*
  //Obtencion de todos
  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
  }
  */

  //Obtencion de todos los productos de un restaurante que esten activos
  async findByRestaurante(restauranteId: number): Promise<Producto[]> {
    // Verificar que el restaurante existe
    const restauranteExists = await this.restauranteRepository.exist({
      where: { id_restaurante: restauranteId }
    });

    if (!restauranteExists) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    return this.productoRepository.find({
      where: {
        restaurante: { id_restaurante: restauranteId },
        activo: 1
      },
      relations: ['subcategoria', 'subcategoria.categoria'],
      order: {
        nombre: 'ASC'
      }
    });
  }
  //Obtencion de todos los productos de un restaurante para gerentes y administradores
  async findAllByRestauranteAdmin(restauranteId: number): Promise<Producto[]> {
    const exists = await this.restauranteRepository.exist({
      where: { id_restaurante: restauranteId },
    });
    if (!exists) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    return this.productoRepository.find({
      where: { restaurante: { id_restaurante: restauranteId } },
      relations: ['subcategoria', 'subcategoria.categoria'],
      order: { nombre: 'ASC' },
    });
  }
  /*
    //Busqueda
    async findOne(id: number): Promise<Producto> {
      const producto = await this.productoRepository.findOne({
        where: { id_producto: id },
        relations: ['subcategoria', 'subcategoria.categoria'],
      });
  
      if (!producto) {
        throw new Error('Producto no encontrado'); // Lanza una excepción
      }
  
      return producto;
    }
    */

  //Busqueda Administradores/Gerentes
  async findOneByIdAdmin(
    id: number,
    restauranteId: number,
  ): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: {
        id_producto: id,
        restaurante: { id_restaurante: restauranteId },
      },
      relations: ['subcategoria', 'subcategoria.categoria', 'restaurante'],
    });

    if (!producto) {
      // O bien 404 si no existe, o 403 si existe pero es de otro restaurante
      throw new NotFoundException(
        `Producto ${id} no encontrado en tu restaurante`,
      );
    }
    return producto;
  }

  //Busqueda
  async findOneActive(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: id, activo: 1 },
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto ${id} no encontrado o no activo`);
    }
    return producto;
  }

  //Creacion
  async create(
    dto: CreateProductoDto,
    file: Express.Multer.File,
  ): Promise<Producto> {
    const imageUrl = await this.storage.uploadFile(
      file.buffer,
      file.originalname,
      'producto'
    );

    const newProducto = this.productoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      imagen_url: imageUrl,
      // Vincular la relación con restaurante y subcategoría:
      restaurante: { id_restaurante: dto.id_restaurante } as any,
      subcategoria: { id_subcategoria: dto.id_subcategoria } as SubcategoriaProducto,
    });

    return this.productoRepository.save(newProducto);
  }

  //Actualizacion
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

    // Si hay nueva imagen
    if (file) {
      producto.imagen_url = await this.storage.uploadFile(
        file.buffer,
        file.originalname,
        'producto'
      );
    }

    if (dto.nombre) producto.nombre = dto.nombre;
    if (dto.descripcion) producto.descripcion = dto.descripcion;
    if (dto.precio !== undefined) producto.precio = dto.precio;
    if (dto.activo === 0 || dto.activo === 1) producto.activo = dto.activo;
    if (dto.id_subcategoria)
      producto.subcategoria = {
        id_subcategoria: dto.id_subcategoria,
      } as SubcategoriaProducto;

    return this.productoRepository.save(producto);
  }

  /*MODIFICACION DE CIERTOS METODOS */
  
  //Creacion producto con imagen como texto
  async createWithImageText(
    dto: CreateProductoTextDto,
    restauranteId: number,
  ): Promise<Producto> {
    const newP = this.productoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      activo: dto.activo ?? 1,
      imagen_url: dto.imagen,
      restaurante: { id_restaurante: restauranteId },
      subcategoria: { id_subcategoria: dto.id_subcategoria },
    });
    return this.productoRepository.save(newP);
  }

  //Actualizacion producto imagen como texto
  async updateWithImageText(
    id: number,
    dto: UpdateProductoTextDto,
    restauranteId: number,
  ): Promise<Producto> {
    const p = await this.productoRepository.findOne({
      where: { id_producto: id },
      relations: ['restaurante', 'subcategoria'],
    });
    if (!p) throw new NotFoundException('Producto no encontrado');
    if (p.restaurante.id_restaurante !== restauranteId)
      throw new UnauthorizedException('No es tu restaurante');

    if (dto.nombre) p.nombre = dto.nombre;
    if (dto.descripcion) p.descripcion = dto.descripcion;
    if (dto.precio !== undefined) p.precio = dto.precio;
    if (dto.activo !== undefined) p.activo = dto.activo;
    if (dto.id_subcategoria)
      p.subcategoria = { id_subcategoria: dto.id_subcategoria } as any;
    if (dto.imagen) p.imagen_url = dto.imagen;

    return this.productoRepository.save(p);
  }

  //Obtener producto con sus complementos
  async obtenerProductoConComplementos(id: number) {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: id, activo: 1 },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    const complementosRelaciones = await this.complementoRepo.find({
      where: { id_producto_principal: id },
      relations: ['complemento'],
    });

    const complementos = complementosRelaciones
      .filter((rel) => rel.estado === 1 && rel.complemento.activo === 1)
      .map((rel) => ({
        id: rel.complemento.id_producto,
        nombre: rel.complemento.nombre,
        descripcion: rel.complemento.descripcion,
        precio: parseFloat(rel.complemento.precio.toString()),
        imagen_url: rel.complemento.imagen_url,
      }));

    return {
      producto_principal: {
        id: producto.id_producto,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio_base: parseFloat(producto.precio.toString()),
        imagen_url: producto.imagen_url,
      },
      complementos,
    };
  }

  //Crear complemento
  async crearComplemento(dto: CreateComplementoDto) {
    const existente = await this.complementoRepo.findOne({
      where: {
        id_producto_principal: dto.id_producto_principal,
        id_producto_complemento: dto.id_producto_complemento,
      },
    });

    if (existente) {
      if (existente.estado === 1) {
        throw new Error('Este complemento ya está registrado');
      } else {
        // Si fue eliminado lógicamente, lo reactivamos
        existente.estado = 1;
        return this.complementoRepo.save(existente);
      }
    }

    const nuevo = this.complementoRepo.create({
      ...dto,
      estado: 1,
    });

    return this.complementoRepo.save(nuevo);
  }

  //Eliminar complemento lógicamente
  async eliminarComplemento(idPrincipal: number, idComplemento: number) {
    const existente = await this.complementoRepo.findOne({
      where: {
        id_producto_principal: idPrincipal,
        id_producto_complemento: idComplemento,
        estado: 1,
      },
    });

    if (!existente) {
      throw new NotFoundException('Complemento no encontrado o ya eliminado');
    }

    existente.estado = 0;
    return this.complementoRepo.save(existente);
  }

}