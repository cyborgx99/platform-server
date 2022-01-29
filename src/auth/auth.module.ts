import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/database/prisma.module';
import { UserResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [UserResolver, AuthService, JwtStrategy],
  controllers: [],
  exports: [JwtStrategy, PassportModule],
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '123123',
      signOptions: {
        expiresIn: 36000,
      },
    }),
  ],
})
export class UserModule {}
