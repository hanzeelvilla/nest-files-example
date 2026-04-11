import { extname } from 'node:path';

import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.getOrThrow<string>('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'R2_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const bucketName = this.configService.getOrThrow<string>('R2_BUCKET_NAME');
    const publicUrl = this.configService.getOrThrow<string>('R2_PUBLIC_URL');

    const fileExtension = extname(file.originalname);
    const fileKey = `${uuidv4()}${fileExtension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return {
        url: `${publicUrl}/${fileKey}`,
        key: fileKey,
      };
    } catch (error) {
      this.logger.error('Error uploading file to R2', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}
