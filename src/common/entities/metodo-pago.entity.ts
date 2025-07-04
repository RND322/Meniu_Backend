import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Suscripcion } from './suscripcion.entity';

@Entity('metodo_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id_metodo_pago: number;

  @Column()
  nombre_propietario: string;

  @Column()
  numero_tarjeta: string;

  @Column()
  cvv: string;

  @Column()
  mes_expiracion: number;

  @Column()
  anio_expiracion: number;

  @Column({ default: 1 })
  activo: number;

  @OneToMany(() => Suscripcion, suscripcion => suscripcion.metodoPago)
  suscripciones: Suscripcion[];

  @ManyToOne(() => Usuario, usuario => usuario.metodosPago)
  usuario: Usuario;
}
