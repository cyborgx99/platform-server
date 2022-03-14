import { Catch, Injectable } from '@nestjs/common';
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
import {
  ResetPasswordLinkDto,
  SetNewPasswordDto,
  SignInDto,
} from './dto/auth.dto';

@Injectable()
@Catch()
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

  async setNewPassword(data: SetNewPasswordDto): Promise<{ success: boolean }> {
    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(
        data.resetToken,
        {
          secret: this.configService.get('JWT_RESET_SECRET'),
        },
      );

      const user = await this.prisma.user.findFirst({
        where: { email: decoded?.email, resetToken: data.resetToken },
      });

      if (user === null || decoded === null) {
        throw new ApolloError(Error_Codes.InvalidOrExpired);
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const updatedUser = await this.prisma.user.update({
        where: { email: user.email },
        data: { password: hashedPassword, resetToken: '' },
      });

      return { success: updatedUser ? true : false };
    } catch (error) {
      if (
        error.message === 'jwt expired' ||
        error.message === 'invalid token'
      ) {
        throw new ApolloError(Error_Codes.InvalidOrExpired);
      } else {
        throw error;
      }
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
    const resetToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_RESET_SECRET'),
      expiresIn: '15m',
    });

    await this.prisma.user.update({
      where: { email: resetPasswordLinkInput.email },
      data: { resetToken },
    });

    const url = `${this.configService.get(
      'CORS_ORIGIN',
    )}/set-password?reset=${resetToken}`;

    await this.mailService.sendEmail(
      `${resetPasswordLinkInput.email}`,
      'Reset Password Request.',
      { url: url, name: `${user?.name}` },
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
