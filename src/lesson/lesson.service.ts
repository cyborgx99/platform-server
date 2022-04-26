import { Injectable } from '@nestjs/common';
import { omitKeysInObject } from 'src/common/utils';
import { PrismaService } from 'src/database/prisma.service';

import { CreateLessonInput } from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  createLesson(data: CreateLessonInput) {
    const createLessonData = omitKeysInObject(['imageId'], data);
    return this.prisma.lesson.create({
      data: {
        ...createLessonData,
        image: {
          connect: { id: data.imageId },
        },
      },
    });
  }
}
