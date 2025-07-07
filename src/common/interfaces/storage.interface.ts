import { Buffer } from 'buffer'; // Importa Buffer directamente de Node.js

export interface IStorageService {
  uploadFile(buffer: Buffer, filename: string): Promise<string>;
  getFileUrl(filename: string): string;
}