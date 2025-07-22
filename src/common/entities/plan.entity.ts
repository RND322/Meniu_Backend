import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Suscripcion } from './suscripcion.entity';

@Entity('planes')
export class Plan {
  @PrimaryGeneratedColumn()
  id_plan!: number;

  @Column({ length: 100 })
  nombre_plan!: string;

  @Column()
  numero_mesas!: number;

  @Column()
  numero_productos!: number;

  @Column()
  numero_cocineros!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio!: number;

  @OneToMany(() => Suscripcion, suscripcion => suscripcion.plan)
  suscripciones!: Suscripcion[];
}
