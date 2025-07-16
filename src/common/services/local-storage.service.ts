import { IStorageService } from '../interfaces/storage.interface';
import * as fs from 'fs';
import * as path from 'path';

export class LocalStorageService implements IStorageService {
  private productUploadPath = path.join(__dirname, '..', '..', '..', 'uploads', 'productos');
  private mesaUploadPath = path.join(__dirname, '..', '..', '..', 'uploads', 'mesas');
  private restauranteUploadPath = path.join(__dirname, '..', '..', '..', 'uploads', 'restaurantes');

  constructor() {
    // Crear las carpetas si no existen
    [this.productUploadPath, this.mesaUploadPath, this.restauranteUploadPath].forEach(path => {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
    });
  }

  async uploadFile(buffer: Buffer, filename: string, type: 'mesa' | 'producto' | 'restaurante'): Promise<string> {
    let uploadPath: string;
    switch (type) {
      case 'mesa':
        uploadPath = this.mesaUploadPath;
        break;
      case 'producto':
        uploadPath = this.productUploadPath;
        break;
      case 'restaurante':
        uploadPath = this.restauranteUploadPath;
        break;
      default:
        throw new Error('Tipo de archivo no soportado');
    }

    const filePath = path.join(uploadPath, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${type}s/${filename}`;
  }

  getFileUrl(filename: string, type: 'mesa' | 'producto' | 'restaurante'): string {
    return `/uploads/${type}s/${filename}`;
  }
}