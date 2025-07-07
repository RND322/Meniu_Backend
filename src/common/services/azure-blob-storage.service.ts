/*
import { IStorageService } from '../interfaces/storage.interface';
import { BlobServiceClient } from '@azure/storage-blob';

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = 'platillos';

export class AzureBlobStorageService implements IStorageService {
  private blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  private containerClient = this.blobServiceClient.getContainerClient(CONTAINER_NAME);

  async uploadFile(buffer: Buffer, filename: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(filename);
    await blockBlobClient.upload(buffer, buffer.length);
    return blockBlobClient.url; // Devuelve la URL pública del archivo
  }

  getFileUrl(filename: string): string {
    return this.containerClient.getBlockBlobClient(filename).url;
  }
}
*/