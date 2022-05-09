import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { SortOrder } from 'src/lesson-image/dto/lesson-image.dto';

import {
  CreateLessonInput,
  GetLessonsResponse,
  LessonPageObject,
} from './dto/lesson.dto';
import { LessonModel } from './models/lesson.model';
import { parseContentSentenceInLessons } from './utils';

@Injectable()
export class LessonService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLesson(
    data: CreateLessonInput,
    userId: string,
  ): Promise<LessonModel> {
    const lesson = await this.prismaService.lesson.create({
      data: {
        userId,
        description: data.description,
        title: data.title,
        pages: {
          create: data.pages.map((page) => ({
            lessonImage: {
              connect: {
                id: page.lessonImageId,
              },
            },
            lessonContent: {
              connect: {
                id: page.lessonContentId,
              },
            },
          })),
        },
      },
      include: {
        pages: {
          include: {
            lessonContent: true,
            lessonImage: true,
          },
        },
      },
    });

    const lessonWithParcedContentSentences: LessonModel = {
      ...lesson,
      pages: lesson.pages.map<LessonPageObject>((page) => {
        return {
          ...page,
          lessonContent: {
            ...page.lessonContent,
            sentences: JSON.parse(page.lessonContent.sentences),
          },
        };
      }),
    };

    return lessonWithParcedContentSentences;
  }

  async getLessons(
    offset: number,
    limit: number,
    userId: string,
    search: string,
    sortOrder: SortOrder,
  ): Promise<GetLessonsResponse> {
    const whereOptions: Prisma.LessonWhereInput = {
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

    const [lessons, totalCount] = await this.prismaService.$transaction([
      this.prismaService.lesson.findMany({
        take: limit,
        skip: offset ?? 0,
        where: whereOptions,
        orderBy: {
          title: sortOrder,
        },
        include: {
          pages: {
            include: {
              lessonContent: true,
              lessonImage: true,
            },
          },
        },
      }),
      this.prismaService.lesson.count({ where: whereOptions }),
    ]);

    const pages = Math.ceil(totalCount / limit);

    const hasMore = offset < totalCount;

    const lessonsWithParcedContentSentences =
      parseContentSentenceInLessons(lessons);

    return {
      data: lessonsWithParcedContentSentences,
      pages,
      totalCount,
      hasMore,
    };
  }
}
