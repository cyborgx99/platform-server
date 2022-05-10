import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import { Error_Codes } from 'src/app.types';
import { PrismaService } from 'src/database/prisma.service';
import { SortOrder } from 'src/lesson-image/dto/lesson-image.dto';

import {
  CreateLessonContentInput,
  DeleteLessonContentResponse,
  GetLessonContentsResponse,
  UpdateLessonContentInput,
} from './dto/lesson-content.dto';
import { LessonContent } from './models/lesson-content.model';

@Injectable()
export class LessonContentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLessonContent(
    data: CreateLessonContentInput,
    userId: string,
  ): Promise<LessonContent> {
    const stringified = JSON.stringify(data.sentences);

    const content = await this.prismaService.lessonContent.create({
      data: { sentences: stringified, title: data.title, userId },
    });

    return {
      id: content.id,
      sentences: JSON.parse(content.sentences),
      title: content.title,
    };
  }

  async getLessonContents(
    offset: number,
    limit: number,
    userId: string,
    search: string,
    sortOrder: SortOrder,
  ): Promise<GetLessonContentsResponse> {
    const whereOptions: Prisma.LessonContentWhereInput = {
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

    const [lessonContent, totalCount] = await this.prismaService.$transaction([
      this.prismaService.lessonContent.findMany({
        take: limit,
        skip: offset ?? 0,
        orderBy: {
          title: sortOrder,
        },
        where: whereOptions,
      }),
      this.prismaService.lessonContent.count({ where: whereOptions }),
    ]);

    const pages = Math.ceil(totalCount / limit);

    const hasMore = offset < totalCount;

    const parsedSentences = lessonContent.map<LessonContent>((content) => {
      return {
        id: content.id,
        sentences: JSON.parse(content.sentences),
        title: content.title,
      };
    });

    return {
      data: parsedSentences,
      pages,
      totalCount,
      hasMore,
    };
  }

  async deleteLessonContent(
    id: string,
    userId: string,
  ): Promise<DeleteLessonContentResponse> {
    const content = await this.prismaService.lessonContent.findFirst({
      where: { id, userId },
    });

    if (content.userId !== userId) {
      throw new ApolloError(Error_Codes.Unathorized);
    }

    const deleted = await this.prismaService.lessonContent.delete({
      where: {
        id,
      },
    });

    return {
      id: deleted.id,
    };
  }

  async updateLessonContent(
    data: UpdateLessonContentInput,
    userId: string,
  ): Promise<LessonContent> {
    const stringified = JSON.stringify(data.sentences);

    const found = await this.prismaService.lessonContent.findFirst({
      where: {
        id: data.id,
        userId,
      },
    });

    if (found.userId !== userId) {
      throw new ApolloError(Error_Codes.Unathorized);
    }

    const updatedContent = await this.prismaService.lessonContent.update({
      where: {
        id: data.id,
      },
      data: { sentences: stringified, title: data.title },
    });

    return {
      id: updatedContent.id,
      sentences: JSON.parse(updatedContent.sentences),
      title: updatedContent.title,
    };
  }
}
