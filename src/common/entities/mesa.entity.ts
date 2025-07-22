import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Restaurante } from './restaurante.entity';
import { Orden } from './orden.entity';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id_mesa!: number;

  @Column()
  numero_mesa!: number;

  @Column()
  qr_code!: string;

  @Column({ length: 50 })
  estado_mesa!: string;

  @ManyToOne(() => Restaurante, restaurante => restaurante.mesas)
  @JoinColumn({ name: 'id_restaurante' })
  restaurante!: Restaurante;

  @OneToMany(() => Orden, orden => orden.mesa)
  ordenes!: Orden[];
}
