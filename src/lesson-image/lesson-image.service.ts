import { Injectable } from '@nestjs/common';
import { LessonImage } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import {
  CreateLessonImageInput,
  GetLessonImagesResponse,
} from './dto/lesson-image.dto';

@Injectable()
export class LessonImageService {
  constructor(private readonly prisma: PrismaService) {}

  async createLessonImage(data: CreateLessonImageInput): Promise<LessonImage> {
    return this.prisma.lessonImage.create({
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
