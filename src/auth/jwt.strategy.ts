import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ApolloError } from 'apollo-server-express';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Error_Messages } from 'src/app.types';
import { PrismaService } from 'src/database/prisma.service';
import { UserWithoutPassword } from 'src/user/dto/user.dto';

import { JwtPayload } from './dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.['token'];

          if (!token) {
            throw new ApolloError(Error_Messages.Unathorized);
          }

          return token;
        },
      ]),
    });
  }

  async validate(payload: JwtPayload): Promise<UserWithoutPassword> {
    const { email } = payload;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        password: false,
        lastName: true,
        name: true,
        id: true,
        role: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApolloError(Error_Messages.Unathorized);
    }

    return user;
  }
}
