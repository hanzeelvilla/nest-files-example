import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './common/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    FilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? '5432'),
      database: process.env.DB_NAME,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    StorageModule,
  ],
})
export class AppModule {}
