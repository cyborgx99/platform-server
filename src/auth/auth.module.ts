import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { UserResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  providers: [UserResolver, AuthService],
  controllers: [],
  exports: [],
  imports: [PrismaModule],
})
export class UserModule {}
