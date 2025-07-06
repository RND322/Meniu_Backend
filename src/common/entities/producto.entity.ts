import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Restaurante } from './restaurante.entity';
import { SubcategoriaProducto } from './subcategoria-producto.entity';
import { OrdenItem } from './orden-item.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column({ length: 100 })
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
  @JoinColumn({ name: 'id_restaurante' })
  restaurante: Restaurante;

  @ManyToOne(() => SubcategoriaProducto, subcategoria => subcategoria.productos)
  @JoinColumn({ name: 'id_subcategoria' })
  subcategoria: SubcategoriaProducto;

  @OneToMany(() => OrdenItem, item => item.producto)
  ordenItems: OrdenItem[];
}
