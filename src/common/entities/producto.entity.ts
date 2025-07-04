import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Restaurante } from './restaurante.entity';
import { SubcategoriaProducto } from './subcategoria-producto.entity';
import { OrdenItem } from './orden-item.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column()
  imagen_url: string;

  @Column({ default: 1 })
  activo: number;

  @ManyToOne(() => Restaurante, restaurante => restaurante.productos)
  restaurante: Restaurante;

  @ManyToOne(() => SubcategoriaProducto, subcategoria => subcategoria.productos)
  subcategoria: SubcategoriaProducto;

  @OneToMany(() => OrdenItem, item => item.producto)
  ordenItems: OrdenItem[];
}
