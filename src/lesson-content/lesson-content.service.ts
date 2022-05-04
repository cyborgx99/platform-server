import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

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
  ): Promise<LessonContent> {
    const stringified = JSON.stringify(data.sentences);

    const content = await this.prismaService.lessonContent.create({
      data: { sentences: stringified, title: data.title },
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
    search: string,
  ): Promise<GetLessonContentsResponse> {
    const whereOptions: Prisma.LessonContentWhereInput = {
      OR: [
        {
          title: {
            startsWith: search,
            mode: 'insensitive',
          },
        },
        { title: { endsWith: search, mode: 'insensitive' } },
      ],
    };

    const [lessonContent, totalCount] = await this.prismaService.$transaction([
      this.prismaService.lessonContent.findMany({
        take: limit,
        skip: offset ?? 0,
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

  async deleteLessonContent(id: string): Promise<DeleteLessonContentResponse> {
    const content = await this.prismaService.lessonContent.delete({
      where: { id },
    });
    return {
      id: content.id,
    };
  }

  async updateLessonContent(
    data: UpdateLessonContentInput,
  ): Promise<LessonContent> {
    const stringified = JSON.stringify(data.sentences);

    const content = await this.prismaService.lessonContent.update({
      where: {
        id: data.id,
      },
      data: { sentences: stringified, title: data.title },
    });

    return {
      id: content.id,
      sentences: JSON.parse(content.sentences),
      title: content.title,
    };
  }
}
