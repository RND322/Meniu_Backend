import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Orden } from './orden.entity';
import { Producto } from './producto.entity';

@Entity('orden_items')
export class OrdenItem {
  @PrimaryGeneratedColumn()
  id_orden_item!: number;

  @Column()
  cantidad!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_unitario!: number;

  @Column({ nullable: true })
  notas!: string;

  @ManyToOne(() => Orden, orden => orden.items)
  @JoinColumn({ name: 'id_orden' })
  orden!: Orden;

  @ManyToOne(() => Producto, producto => producto.ordenItems)
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;
}
