import {Entity, PrimaryColumn, ManyToOne, JoinColumn, Column} from 'typeorm';
import { Producto } from './producto.entity';

@Entity('productos_complementos')
export class ProductoComplemento {
  @PrimaryColumn()
  id_producto_principal!: number;

  @PrimaryColumn()
  id_producto_complemento!: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'id_producto_principal' })
  productoPrincipal!: Producto;

  @Column({ type: 'tinyint', default: 1 })
  estado!: number; // 1 = activo, 0 = eliminado lógicamente

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto_complemento' })
  complemento!: Producto;
}