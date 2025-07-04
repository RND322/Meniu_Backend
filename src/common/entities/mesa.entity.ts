/*
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Restaurante } from './restaurante.entity';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id_mesa: number;

  @Column()
  numero_mesa: number;

  @Column()
  qr_code: string;

  @Column()
  estado_mesa: string;

  @ManyToOne(() => Restaurante, restaurante => restaurante.mesas)
  restaurante: Restaurante;
}
*/

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Restaurante } from './restaurante.entity';
import { Orden } from './orden.entity'; 

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id_mesa: number;

  @Column()
  numero_mesa: number;

  @Column()
  qr_code: string;

  @Column()
  estado_mesa: string;

  @ManyToOne(() => Restaurante, restaurante => restaurante.mesas)
  restaurante: Restaurante;

  @OneToMany(() => Orden, orden => orden.mesa)
  ordenes: Orden[];
}
