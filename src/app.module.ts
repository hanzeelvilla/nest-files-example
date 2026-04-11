import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './common/storage/storage.module';

@Module({
  imports: [
    FilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StorageModule,
  ],
})
export class AppModule {}
