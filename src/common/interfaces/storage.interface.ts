import { Buffer } from 'buffer';

export interface IStorageService {
  uploadFile(buffer: Buffer, filename: string, type: 'mesa' | 'producto' | 'restaurante' | 'usuario'): Promise<string>;  
  getFileUrl(filename: string, type: 'mesa' | 'producto' | 'restaurante' | 'usuario'): string; 
}