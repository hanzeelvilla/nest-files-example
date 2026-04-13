import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { StorageModule } from '../common/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [StorageModule, TypeOrmModule.forFeature([File])],
})
export class FilesModule {}
