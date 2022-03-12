import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ApolloError } from 'apollo-server-express';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Error_Codes } from 'src/app.types';
import { PrismaService } from 'src/database/prisma.service';

import { JwtPayload, UserWithoutPassword } from './auth.types';

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
          const data = request?.cookies['token'];

          if (!data) {
            throw new ApolloError(Error_Codes.Unathorized);
          }

          return data;
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
      },
    });

    if (!user) {
      throw new ApolloError(Error_Codes.Unathorized);
    }

    return user;
  }
}
