import { Injectable } from '@nestjs/common';
import { omitKeyInObject } from 'src/common/utils';
import { PrismaService } from 'src/database/prisma.service';

import { CreateLessonInput } from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  createLesson(data: CreateLessonInput) {
    const createLessonData = omitKeyInObject('imageId', data);
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
