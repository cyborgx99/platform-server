import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import {
  CreateLessonContentInput,
  GetLessonContentsResponse,
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
    const [lessonContent, totalCount] = await this.prismaService.$transaction([
      this.prismaService.lessonContent.findMany({
        take: limit,
        skip: offset ?? 0,
        where: {
          OR: [
            {
              title: {
                startsWith: search,
                mode: 'insensitive',
              },
            },
            { title: { endsWith: search, mode: 'insensitive' } },
          ],
        },
      }),
      this.prismaService.lessonImage.count(),
    ]);

    const pages = Math.ceil(totalCount / limit);

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
      totalCount: totalCount,
    };
  }
}
