import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn()
  id_persona: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @ManyToOne(() => Usuario, usuario => usuario.personas)
  usuario: Usuario;
}
