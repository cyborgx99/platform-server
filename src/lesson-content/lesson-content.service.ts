import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { CreateLessonContentInput } from './dto/lesson-content.dto';

@Injectable()
export class LessonContentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLessonContent(data: CreateLessonContentInput) {
    console.log(data);
  }
}
