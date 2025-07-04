import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Restaurante } from './restaurante.entity';
import { MetodoPago } from './metodo-pago.entity';
import { Plan } from './plan.entity';

@Entity('suscripciones')
export class Suscripcion {
  @PrimaryGeneratedColumn()
  id_suscripcion: number;

  @Column({ type: 'date' })
  fecha_inicio: string;

  @Column({ type: 'date' })
  fecha_cobro: string;

  @Column({ default: 1 })
  activa: number;

  @ManyToOne(() => Restaurante, restaurante => restaurante.suscripciones)
  restaurante: Restaurante;

  @ManyToOne(() => MetodoPago, metodoPago => metodoPago.suscripciones)
  metodoPago: MetodoPago;

  @ManyToOne(() => Plan, plan => plan.suscripciones)
  plan: Plan;
}
