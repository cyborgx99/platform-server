import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

import { LessonContentResolver } from './lesson-content.resolver';
import { LessonContentService } from './lesson-content.service';

@Module({
  imports: [PrismaModule],
  providers: [LessonContentResolver, LessonContentService],
})
export class LessonContentModule {}
