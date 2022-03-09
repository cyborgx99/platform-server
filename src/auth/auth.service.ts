import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CookieOptions } from 'express';

import { PrismaService } from '../database/prisma.service';
import { Ctx, JwtPayload } from './auth.types';
import { SignInDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser(
    data: Prisma.UserCreateInput,
  ): Promise<{ success: boolean }> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    return { success: user ? true : false };
  }

  async getUserToken(
    data: SignInDto,
    context: Ctx,
  ): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user && (await bcrypt.compare(data.password, user.password))) {
      const payload: JwtPayload = { email: user.email };
      const accessToken = await this.jwtService.sign(payload);

      const cookieOptions: CookieOptions = {
        domain: this.configService.get('COOKIE_OPTION_DOMAIN'),
        secure: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: 'strict',
        httpOnly: true,
        path: '/',
      };

      // Set the JWT in a cookie
      context.res.cookie('token', accessToken, cookieOptions);
      return { success: true };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
