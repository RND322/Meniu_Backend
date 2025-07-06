import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol: number;

  @Column({ name: 'nombre_rol' , length: 50})
  nombreRol: string;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios: Usuario[];
}
