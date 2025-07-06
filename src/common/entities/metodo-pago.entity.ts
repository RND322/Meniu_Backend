import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Suscripcion } from './suscripcion.entity';

@Entity('metodo_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id_metodo_pago: number;

  @Column({ length: 100 })
  nombre_propietario: string;

  @Column({ length: 20 })
  numero_tarjeta: string;

  @Column({ length: 5 })
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
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
