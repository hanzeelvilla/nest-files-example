import { Injectable } from '@nestjs/common';
import { StorageService } from '../common/storage/storage.service';
@Injectable()
export class FilesService {
  constructor(private readonly storageService: StorageService) {}

  async uploadFile(file: Express.Multer.File) {
    return await this.storageService.uploadFile(file);
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
