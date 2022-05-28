import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { LessonImage, Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { Error_Codes } from 'src/app.types';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/database/prisma.service';

import {
  CreateLessonImageInput,
  DeleteLessonImageInput,
  GetImagesQueryArgs,
  PaginatedImagesResponse,
  UpdateLessonImageInput,
} from './dto/lesson-image.dto';
import {
  deleteFromCloudinary,
  DeleteFromCloudinaryEvent,
} from './events/delete-from-cloudinary.event';

@Injectable()
export class LessonImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createLessonImage(
    data: CreateLessonImageInput,
    userId: string,
  ): Promise<LessonImage> {
    return this.prisma.lessonImage.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async deleteLessonImage(
    data: DeleteLessonImageInput,
    userId: string,
  ): Promise<LessonImage> {
    const image = await this.prisma.lessonImage.findFirst({
      where: { id: data.id, userId },
    });

    if (!image || image.userId !== userId) {
      throw new ApolloError(Error_Codes.Unathorized);
    }

    if (data.publicId) {
      this.eventEmitter.emit(
        deleteFromCloudinary,
        new DeleteFromCloudinaryEvent(data.publicId),
      );
    }

    return this.prisma.lessonImage.delete({ where: { id: data.id } });
  }

  async updateLessonImage(
    data: UpdateLessonImageInput,
    userId: string,
  ): Promise<LessonImage> {
    const image = await this.prisma.lessonImage.findFirst({
      where: { id: data.id, userId },
    });

    if (!image || image.userId !== userId) {
      throw new ApolloError(Error_Codes.Unathorized);
    }

    if (image.publicId) {
      this.eventEmitter.emit(
        deleteFromCloudinary,
        new DeleteFromCloudinaryEvent(data.publicId),
      );
    }

    return this.prisma.lessonImage.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  @OnEvent(deleteFromCloudinary, { async: true })
  async deleteFromCloudinary(payload: DeleteFromCloudinaryEvent) {
    await this.cloudinary.deleteImage(payload.publicId);
  }

  async getLessonImages(
    { offset, limit, search, sortOrder }: GetImagesQueryArgs,
    userId: string,
  ): Promise<PaginatedImagesResponse> {
    const whereOptions: Prisma.LessonImageWhereInput = {
      OR: [
        {
          title: {
            startsWith: search,
            mode: 'insensitive',
          },
          userId,
        },
        { title: { endsWith: search, mode: 'insensitive' }, userId },
      ],
    };

    const [lessonImages, totalLessonImages] = await this.prisma.$transaction([
      this.prisma.lessonImage.findMany({
        take: limit,
        skip: offset ?? 0,
        orderBy: {
          title: sortOrder,
        },
        where: whereOptions,
      }),
      this.prisma.lessonImage.count({ where: whereOptions }),
    ]);

    const pages = Math.ceil(totalLessonImages / limit);

    const hasMore = offset < totalLessonImages && totalLessonImages > limit;

    return {
      data: lessonImages,
      pages,
      totalCount: totalLessonImages,
      hasMore,
    };
  }
}
