import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
  const secret = configService.get<string>('JWT_SECRET');
  //console.log('SECRET USED:', secret);
  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }
  
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  });
}

  async validate(payload: any) {
    //console.log('VALIDATING PAYLOAD:', payload); 
    return {
      id: payload.sub,
      username: payload.username,
      rol: payload.rol,
      restaurante_id: payload.restaurante_id,
      nombre: payload.nombre,
      apellidos: payload.apellidos,
      email: payload.email,
      restaurante_nombre: payload.restaurante_nombre,
    };
  }
}
