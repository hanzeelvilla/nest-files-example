import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from '../common/storage/storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly storageService: StorageService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    // upload file to r2
    const { key, url } = await this.storageService.uploadFile(file);

    // save file info to database
    const newFile = this.fileRepository.create({
      key,
      url,
    });

    return await this.fileRepository.save(newFile);
  }

  async remove(id: string) {
    const file = await this.fileRepository.findOneBy({ id });

    if (!file) throw new BadRequestException(`File with id ${id} not found`);

    await this.storageService.deleteFile(file.key);
    await this.fileRepository.delete(id);
  }
}
