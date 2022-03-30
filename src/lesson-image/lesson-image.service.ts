import { Injectable } from '@nestjs/common';
import { LessonImage } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/database/prisma.service';

import {
  CreateLessonImageInput,
  DeleteLessonImageInput,
  GetLessonImagesResponse,
  UpdateLessonImageInput,
} from './dto/lesson-image.dto';

@Injectable()
export class LessonImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async createLessonImage(data: CreateLessonImageInput): Promise<LessonImage> {
    return this.prisma.lessonImage.create({
      data,
    });
  }

  async deleteLessonImage(data: DeleteLessonImageInput): Promise<LessonImage> {
    if (data.publicId) {
      this.cloudinary.deleteImage(data.publicId);
    }

    return this.prisma.lessonImage.delete({ where: { id: data.id } });
  }

  async updateLessonImage(data: UpdateLessonImageInput): Promise<LessonImage> {
    return this.prisma.lessonImage.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async getLessonImages(
    offset: number,
    limit: number,
  ): Promise<GetLessonImagesResponse> {
    const [lessonImages, totalLessonImages] = await this.prisma.$transaction([
      this.prisma.lessonImage.findMany({
        take: limit,
        skip: offset ?? 0,
      }),
      this.prisma.lessonImage.count(),
    ]);

    const pages = Math.ceil(totalLessonImages / limit);

    return {
      data: lessonImages,
      pages,
      totalCount: totalLessonImages,
    };
  }
}
