import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn()
  id_email: number;

  @Column({ length: 100 })
  email: string;

  @ManyToOne(() => Usuario, usuario => usuario.emails)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
