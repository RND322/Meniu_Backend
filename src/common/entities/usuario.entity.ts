import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Rol } from './rol.entity';
import { Persona } from './persona.entity';
import { Email } from './email.entity';
import { Restaurante } from './restaurante.entity';
import { MetodoPago } from './metodo-pago.entity'; 

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column({ name: 'nombre_usuario',  length: 100 })
  nombreUsuario!: string;

  @Column({ length: 100 })
  password!: string;

  @Column({ default: 1 })
  activo!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion!: Date;

  @ManyToOne(() => Rol, rol => rol.usuarios)
  @JoinColumn({ name: 'id_rol' })
  rol!: Rol;

  @OneToMany(() => Persona, persona => persona.usuario)
  personas!: Persona[];

  @OneToMany(() => Email, email => email.usuario)
  emails!: Email[];

  @OneToMany(() => Restaurante, restaurante => restaurante.usuario)
  restaurantes!: Restaurante[];

  @OneToMany(() => MetodoPago, metodoPago => metodoPago.usuario)
  metodosPago!: MetodoPago[];
}
