import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CategoriaProducto } from './categoria-producto.entity';
import { Producto } from './producto.entity';

@Entity('subcategorias_productos')
export class SubcategoriaProducto {
  @PrimaryGeneratedColumn()
  id_subcategoria!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ default: 1 })
  activa!: number;

  @ManyToOne(() => CategoriaProducto, categoria => categoria.subcategorias)
  @JoinColumn({ name: 'id_categoria' })
  categoria!: CategoriaProducto;

  @OneToMany(() => Producto, producto => producto.subcategoria)
  productos!: Producto[];
}
