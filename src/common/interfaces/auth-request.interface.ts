import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    sub: number;              
    username: string;
    rol: string;
    nombre: string;
    apellidos: string;
    email: string;
    restaurante_id: number;
    restaurante_nombre: string;
    // …otros campos que pongas en el payload
  };
}