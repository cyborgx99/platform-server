import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

import { LessonResolver } from './lesson.resolver';
import { LessonService } from './lesson.service';

@Module({
  providers: [LessonService, LessonResolver],
  imports: [PrismaModule],
})
export class LessonModule {}
