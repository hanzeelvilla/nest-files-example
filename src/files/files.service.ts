import { Injectable } from '@nestjs/common';
import { StorageService } from '../common/storage/storage.service';
@Injectable()
export class FilesService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFile(file: Express.Multer.File) {
    return await this.storageService.uploadFile(file);
  }

  async remove(id: string) {
    return await this.storageService.deleteFile(id);
  }
}
