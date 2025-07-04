import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Restaurante } from './restaurante.entity';
import { Mesa } from './mesa.entity';
import { OrdenItem } from './orden-item.entity';

@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn()
  id_orden: number;

  @Column()
  estado: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ nullable: true })
  hora_confirmacion: string;

  @Column({ nullable: true })
  hora_lista: string;

  @Column({ nullable: true })
  hora_entregada: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  impuestos: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ default: false })
  solicitud_pago: boolean;

  @ManyToOne(() => Restaurante, restaurante => restaurante.ordenes)
  restaurante: Restaurante;

  @ManyToOne(() => Mesa, mesa => mesa.ordenes)
  mesa: Mesa;

  @OneToMany(() => OrdenItem, item => item.orden)
  items: OrdenItem[];
}
