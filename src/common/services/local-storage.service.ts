import { IStorageService } from '../interfaces/storage.interface';
import * as fs from 'fs';
import * as path from 'path';

export class LocalStorageService implements IStorageService {
  private uploadPath = path.join(__dirname, '..', '..', '..', 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(buffer: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.uploadPath, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}