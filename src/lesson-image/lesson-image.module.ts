import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

import { LessonImageResolver } from './lesson-image.resolver';
import { LessonImageService } from './lesson-image.service';

@Module({
  providers: [LessonImageResolver, LessonImageService],
  imports: [PrismaModule],
})
export class LessonImageModule {}
