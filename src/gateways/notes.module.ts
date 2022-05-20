import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

import { NotesGateway } from './notes.gateway';

@Module({
  providers: [NotesGateway],
  imports: [PrismaModule],
})
export class NotesModule {}
