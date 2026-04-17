import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { StorageModule } from '../common/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [StorageModule, TypeOrmModule.forFeature([File]), AuthModule],
})
export class FilesModule {}
