import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Restaurante } from './restaurante.entity';
import { Mesa } from './mesa.entity';
import { OrdenItem } from './orden-item.entity';

@Entity('ordenes')
export class Orden {
  @PrimaryGeneratedColumn()
  id_orden!: number;

  @Column({ length: 50 })
  estado!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha!: Date;

  @Column(({ type: 'time', nullable: true }))
  hora_confirmacion!: string;

  @Column(({ type: 'time', nullable: true }))
  hora_lista!: string;

  @Column(({ type: 'time', nullable: true }))
  hora_entregada!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  impuestos!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column({ default: false })
  solicitud_pago!: boolean;

  @ManyToOne(() => Restaurante, restaurante => restaurante.ordenes)
  @JoinColumn({ name: 'id_restaurante' })
  restaurante!: Restaurante;

  @ManyToOne(() => Mesa, mesa => mesa.ordenes)
  @JoinColumn({ name: 'id_mesa' })
  mesa!: Mesa;

  @OneToMany(() => OrdenItem, item => item.orden)
  items!: OrdenItem[];
}
