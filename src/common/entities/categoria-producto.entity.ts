import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubcategoriaProducto } from './subcategoria-producto.entity';

@Entity('categorias_productos')
export class CategoriaProducto {
  @PrimaryGeneratedColumn()
  id_categoria: number;

  @Column()
  nombre: string;

  @Column({ default: 1 })
  activa: number;

  @OneToMany(() => SubcategoriaProducto, subcategoria => subcategoria.categoria)
  subcategorias: SubcategoriaProducto[];
}
