import { Controller, Param, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { Storage } from '@google-cloud/storage';
import { FileInterceptor } from '@nestjs/platform-express';
import { Post, UploadedFile, Get } from '@nestjs/common';
import { dirname } from 'path';
import { join } from 'path';

@Controller()
export class AppController {
  private storage: Storage;
  private bucketName = 'penny-assessment-products';
  constructor(private readonly appService: AppService) {
    this.storage = new Storage({
      keyFilename: join(
        dirname(__dirname),
        '..',
        '..',
        'penny-assessment-441521-3b8d0593110d.json'
      ),
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new Error('File is required!');
    }

    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream
        .on('finish', () => {
          resolve({
            url: `https://storage.googleapis.com/${this.bucketName}/${blob.name}`,
          });
        })
        .on('error', (error) => {
          reject(error);
        })
        .end(file.buffer);
    });
  }

  @Get('fetch-file')
  async fetchFile(@Param('fileName') fileName: string) {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(fileName);

    return new Promise((resolve, reject) => {
      blob.download((error, content) => {
        if (error) {
          reject(error);
        } else {
          resolve(content);
        }
      });
    });
  }
}
