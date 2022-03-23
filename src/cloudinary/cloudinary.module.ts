import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { UploadResolver } from './upload.resolver';

@Module({
  providers: [
    CloudinaryProvider,
    CloudinaryService,
    ConfigService,
    UploadResolver,
  ],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
