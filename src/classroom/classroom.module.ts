import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PrismaModule } from 'src/database/prisma.module';

import { ClassroomResolver } from './classroom.resolver';
import { ClassroomService } from './classroom.service';

@Module({
  providers: [ClassroomResolver, ClassroomService],
  imports: [PrismaModule, CloudinaryModule],
})
export class ClassroomModule {}
