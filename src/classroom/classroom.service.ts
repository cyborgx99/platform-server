import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ClassroomService {
  constructor(private readonly prisma: PrismaService) {}

  async createLessonImage() {
    return '';
  }
}
