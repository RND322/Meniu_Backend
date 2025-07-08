import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/common/entities/usuario.entity';
import { Persona } from 'src/common/entities/persona.entity';
import { Email } from 'src/common/entities/email.entity';
import { Rol } from 'src/common/entities/rol.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Persona) private personaRepo: Repository<Persona>,
    @InjectRepository(Email) private emailRepo: Repository<Email>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
  ) {}

  //Modificar datos de un usuario
  async actualizarUsuario(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: id }, relations: ['rol'] });
    if (!usuario) throw new Error('Usuario no encontrado');

    if (dto.password) {
      const hashed = await bcrypt.hash(dto.password, 10);
      usuario.password = hashed;
    }

    if (dto.activo !== undefined) usuario.activo = dto.activo;
    if (dto.id_rol !== undefined) {
      const nuevoRol = await this.rolRepo.findOneBy({ id_rol: dto.id_rol });
      if (!nuevoRol) throw new Error('Rol no encontrado');
      usuario.rol = nuevoRol;
    }

    await this.usuarioRepo.save(usuario);

    const persona = await this.personaRepo.findOne({ where: { usuario: { id_usuario: id } } });
    if (persona) {
      if (dto.nombre) persona.nombre = dto.nombre;
      if (dto.apellidos) persona.apellidos = dto.apellidos;
      await this.personaRepo.save(persona);
    }

    const email = await this.emailRepo.findOne({ where: { usuario: { id_usuario: id } } });
    if (email && dto.email) {
      email.email = dto.email;
      await this.emailRepo.save(email);
    }

    return { message: 'Usuario actualizado correctamente' };
  }
    //Obtencion detalles de un usuario
    async obtenerDetalleUsuario(id: number) {
        const usuario = await this.usuarioRepo.findOne({
            where: { id_usuario: id },
            relations: ['rol', 'personas', 'emails'],
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const persona = usuario.personas[0];
        const email = usuario.emails[0];

        return {
            id_usuario: usuario.id_usuario,
            nombreUsuario: usuario.nombreUsuario,
            activo: usuario.activo,
            nombre: persona?.nombre ?? '',
            apellidos: persona?.apellidos ?? '',
            email: email?.email ?? '',
            rol: usuario.rol?.nombreRol ?? '',
        };
    }

    //Obtiene todos los usuarios
    async obtenerTodosDetalle() {
        const usuarios = await this.usuarioRepo.find({
            relations: ['rol', 'personas', 'emails'],
        });

        return usuarios.map((usuario) => {
            const persona = usuario.personas[0];
            const email = usuario.emails[0];

            return {
            id_usuario: usuario.id_usuario,
            nombreUsuario: usuario.nombreUsuario,
            activo: usuario.activo,
            nombre: persona?.nombre ?? '',
            apellidos: persona?.apellidos ?? '',
            email: email?.email ?? '',
            rol: usuario.rol?.nombreRol ?? '',
            };
        });
    }
}