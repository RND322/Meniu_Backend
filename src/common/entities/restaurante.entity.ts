import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Mesa } from './mesa.entity';
import { Producto } from './producto.entity';
import { Orden } from './orden.entity';
import { Suscripcion } from './suscripcion.entity';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn()
  id_restaurante!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 150 })
  email!: string;

  @Column()
  direccion!: string;

  @Column({ length: 20 })
  telefono!: string;

  @Column()
  logo_url!: string;

  @Column('text')
  descripcion!: string;

  @Column({ default: 1 })
  activo!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion!: Date;

  @OneToMany(() => Usuario, usuario => usuario.restaurante)
  usuarios!: Usuario[];

  @OneToMany(() => Mesa, mesa => mesa.restaurante)
  mesas!: Mesa[];

  @OneToMany(() => Producto, producto => producto.restaurante)
  productos!: Producto[];

  @OneToMany(() => Orden, orden => orden.restaurante)
  ordenes!: Orden[];

  @OneToMany(() => Suscripcion, suscripcion => suscripcion.restaurante)
  suscripciones!: Suscripcion[];
}
