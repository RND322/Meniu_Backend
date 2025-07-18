import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/common/entities/usuario.entity';
import { Persona } from 'src/common/entities/persona.entity';
import { Restaurante } from 'src/common/entities/restaurante.entity';
import { Rol } from 'src/common/entities/rol.entity';
import { Email } from 'src/common/entities/email.entity';
import { Repository } from 'typeorm';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { hashPassword } from 'src/pass_generator/hash-generator';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Persona) private personaRepo: Repository<Persona>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
    @InjectRepository(Email) private emailRepo: Repository<Email>,
    @InjectRepository(Restaurante) private restauranteRepo: Repository<Restaurante>,
  ) { }

  //Crear un persona con su usuario
  async crearPersonaConUsuario(dto: CreatePersonaDto) {
    const { nombre, apellidos, email, id_rol, id_restaurante } = dto;

    const simbolos = ['?', '.', ',', '!', ':', ';'];
    const userNumero = Math.floor(100 + Math.random() * 900);
    const nombreUsuario = `${nombre}${apellidos}${userNumero}`.replace(/\s+/g, '');
    const simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
    const passNumero = Math.floor(1000 + Math.random() * 9000);
    const password = `${nombre}${simbolo}${passNumero}`;
    const hashedPassword = await hashPassword(password);

    const rol = await this.rolRepo.findOneBy({ id_rol });
    if (!rol) throw new Error('Rol no encontrado');

    const restaurante = await this.restauranteRepo.findOneBy({ id_restaurante });
    if (!restaurante) throw new Error('Restaurante no encontrado');

    const nuevoUsuario = this.usuarioRepo.create({
      nombreUsuario,
      password: hashedPassword,
      rol,
      restaurante,
      activo: 1,
    });
    const usuarioGuardado = await this.usuarioRepo.save(nuevoUsuario);

    await this.personaRepo.save({
      nombre,
      apellidos,
      usuario: usuarioGuardado,
    });

    await this.emailRepo.save({
      email,
      usuario: usuarioGuardado,
    });

    return {
      nombre,
      apellidos,
      email,
      nombre_usuario: nombreUsuario,
      password,
    };
  }
}
