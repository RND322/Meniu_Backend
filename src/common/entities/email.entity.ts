import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn()
  id_email: number;

  @Column()
  email: string;

  @ManyToOne(() => Usuario, usuario => usuario.emails)
  usuario: Usuario;
}
