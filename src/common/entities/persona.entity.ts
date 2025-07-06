import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id_persona: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellidos: string;

  @ManyToOne(() => Usuario, usuario => usuario.personas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
