import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Orden } from './orden.entity';
import { Producto } from './producto.entity';

@Entity('orden_items')
export class OrdenItem {
  @PrimaryGeneratedColumn()
  id_orden_item: number;

  @Column()
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ nullable: true })
  notas: string;

  @ManyToOne(() => Orden, orden => orden.items)
  orden: Orden;

  @ManyToOne(() => Producto, producto => producto.ordenItems)
  producto: Producto;
}
