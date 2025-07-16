import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaProducto } from 'src/common/entities/categoria-producto.entity';
import { SubcategoriaProducto } from 'src/common/entities/subcategoria-producto.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
    constructor(
        @InjectRepository(CategoriaProducto)
        private readonly categoriaRepo: Repository<CategoriaProducto>,
        @InjectRepository(SubcategoriaProducto)
        private readonly subRepo: Repository<SubcategoriaProducto>,
    ) { }

    //Todas las categorias en estado activas
    async findAllActive(): Promise<CategoriaProducto[]> {
        const cats = await this.categoriaRepo.find({
            where: { activa: 1 },
            relations: ['subcategorias'],
        });
        return cats.map(cat => ({
            ...cat,
            subcategorias: cat.subcategorias.filter(sub => sub.activa === 1),
        }));
    }

    //Todas las categorias para Gerente/Administrador
    async findAllAdmin(): Promise<CategoriaProducto[]> {
        const count = await this.categoriaRepo.count();
        if (count === 0) {
            throw new NotFoundException('No hay categorías definidas');
        }
        return this.categoriaRepo.find({
            relations: ['subcategorias'],
            order: { nombre: 'ASC' },
        });
    }

    // Crea una nueva categoría 
    async createCategoria(dto: CreateCategoriaDto): Promise<CategoriaProducto> {
        const nueva = this.categoriaRepo.create({ nombre: dto.nombre });
        return this.categoriaRepo.save(nueva);
    }

    ///Crea una nueva subcategoría bajo una categoría existente 
    async createSubcategoria(
        id_categoria: number,
        dto: CreateSubcategoriaDto,
    ): Promise<SubcategoriaProducto> {
        const cat = await this.categoriaRepo.findOneBy({ id_categoria });
        if (!cat) {
            throw new NotFoundException(`Categoría ${id_categoria} no encontrada`);
        }
        const sub = this.subRepo.create({
            nombre: dto.nombre,
            categoria: { id_categoria } as CategoriaProducto,
        });
        return this.subRepo.save(sub);
    }

    //Actualiza una categoria
    async updateCategoria(
        id_categoria: number,
        dto: UpdateCategoriaDto,
    ): Promise<CategoriaProducto> {
        const cat = await this.categoriaRepo.findOneBy({ id_categoria });
        if (!cat) {
            throw new NotFoundException(`Categoría ${id_categoria} no encontrada`);
        }
        if (dto.nombre !== undefined) cat.nombre = dto.nombre;
        if (dto.activa !== undefined) cat.activa = dto.activa;
        return this.categoriaRepo.save(cat);
    }

    //Actualiza una subcategoria
    async updateSubcategoria(
        id_subcategoria: number,
        dto: UpdateSubcategoriaDto,
    ): Promise<SubcategoriaProducto> {
        // Buscamos la subcategoría directamente
        const sub = await this.subRepo.findOne({
            where: { id_subcategoria },
            relations: ['categoria'],  // opcional si quieres mostrar datos de la categoría
        });
        if (!sub) {
            throw new NotFoundException(
                `Subcategoría ${id_subcategoria} no encontrada`,
            );
        }

        if (dto.nombre !== undefined) sub.nombre = dto.nombre;
        if (dto.activa !== undefined) sub.activa = dto.activa;
        return this.subRepo.save(sub);
    }
}
