import { Buffer } from 'buffer';

export interface IStorageService {
  uploadFile(buffer: Buffer, filename: string, type: 'mesa' | 'producto' | 'restaurante' | 'usuario'): Promise<string>;  // Agregamos el tercer parámetro 'type'
  getFileUrl(filename: string, type: 'mesa' | 'producto' | 'restaurante' | 'usuario'): string;  // También ajustamos esta función
}