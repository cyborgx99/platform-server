import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import { CookieOptions } from 'express';
import { Error_Codes } from 'src/app.types';
import { MailService } from 'src/mail/mail.service';

import { PrismaService } from '../database/prisma.service';
import { Ctx, JwtPayload } from './auth.types';
import { ResetPasswordLinkDto, SignInDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  cookieOptions: CookieOptions = {
    domain: this.configService.get('COOKIE_OPTION_DOMAIN'),
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
  };

  async createUser(
    data: Prisma.UserCreateInput,
  ): Promise<{ success: boolean }> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    try {
      const user = await this.prisma.user.create({
        data: { ...data, password: hashedPassword },
      });

      return { success: user ? true : false };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ApolloError(Error_Codes.UserConflict);
        }
      }
      throw error;
    }
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

      // Set the JWT in a cookie
      context.res.cookie('token', accessToken, this.cookieOptions);
      return { success: true };
    } else {
      throw new ApolloError(Error_Codes.InvalidCredentials);
    }
  }

  async createResetPasswordLink(
    resetPasswordLinkInput: ResetPasswordLinkDto,
  ): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { email: resetPasswordLinkInput.email },
    });

    if (!user) {
      throw new ApolloError(Error_Codes.SomethingWentWrong);
    }

    const payload: JwtPayload = { email: resetPasswordLinkInput.email };
    const resetToken = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_RESET_SECRET'),
    });

    const url = `http://localhost:3000/forgot-password?reset=${resetToken}`;

    this.mailService.sendEmail(
      'cyborgx999@gmail.com',
      'hello',
      { url: url, name: 'Server' },
      'resetPassword',
    );

    return { success: true };
  }

  async logout(context: Ctx): Promise<{ success: boolean }> {
    // Clear  cookie
    context.res.clearCookie('token', this.cookieOptions);
    return { success: true };
  }
}
