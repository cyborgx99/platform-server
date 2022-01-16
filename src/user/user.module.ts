import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [UserResolver, UserService],
  controllers: [],
  exports: [],
  imports: [PrismaModule],
})
export class UserModule {}
