import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [UserService, UserResolver],
  imports: [PrismaModule],
})
export class UserModule {}
