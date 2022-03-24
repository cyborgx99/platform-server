import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreateLessonInput } from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  createLesson(data: CreateLessonInput) {
    return this.prisma.lesson.create({ data });
  }
}
