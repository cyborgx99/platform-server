import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: FileUpload,
    folderPath = 'platform/lessons',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const stream = file.createReadStream();
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: folderPath,
          transformation: [{ width: '0.75', crop: '1fill' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      Readable.from(buffer).pipe(upload);
    });
  }
}
