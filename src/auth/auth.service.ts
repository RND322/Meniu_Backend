import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../common/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string;
   }> {
    const { nombre_usuario, password } = loginDto;

    const usuario = await this.usuarioRepository.findOne({
      where: { nombreUsuario: nombre_usuario },
      relations: ['rol', 'personas', 'emails'],
    });

    if (!usuario || !usuario.activo || !(await bcrypt.compare(password, usuario.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const persona = usuario.personas[0];
    const email = usuario.emails[0];

    const payload = {
      sub: usuario.id_usuario,
      username: usuario.nombreUsuario,
      rol: usuario.rol.nombreRol,
      nombre: persona?.nombre ?? '',
      apellidos: persona?.apellidos ?? '',
      email: email?.email ?? '',
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
