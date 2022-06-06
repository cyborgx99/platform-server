import { Catch, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { ApolloError } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import { CookieOptions } from 'express';
import { Error_Messages } from 'src/app.types';
import { MailService } from 'src/mail/mail.service';

import { PrismaService } from '../database/prisma.service';
import {
  AuthSuccessResponse,
  ConfirmEmailInput,
  CreateResetPasswordLinkInput,
  Ctx,
  JwtPayload,
  ResendConfirmationEmailInput,
  SetNewPasswordInput,
  SignInInput,
} from './dto/auth.dto';
import {
  sendConfirmationEmail,
  SendConfirmationEmailEvent,
} from './events/confirmation-email.event';

@Injectable()
@Catch()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  cookieOptions: CookieOptions = {
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
    path: '/',
  };

  async createUser(data: Prisma.UserCreateInput): Promise<AuthSuccessResponse> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    try {
      const user = await this.prisma.user.create({
        data: { ...data, password: hashedPassword },
      });

      if (!user) {
        throw new ApolloError(Error_Messages.UserConflict);
      }

      this.eventEmitter.emit(
        sendConfirmationEmail,
        new SendConfirmationEmailEvent(data.email),
      );

      return { success: true };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ApolloError(Error_Messages.UserConflict);
        }
      }
      throw error;
    }
  }

  @OnEvent(sendConfirmationEmail, { async: true })
  async sendConfirmationEmail(payload: SendConfirmationEmailEvent) {
    const tokenPayload: JwtPayload = { email: payload.email };
    const token = await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get('JWT_RESET_SECRET'),
      expiresIn: '20m',
    });

    const url = `${this.configService.get(
      'CORS_ORIGIN',
    )}/confirm?email=${token}`;

    await this.mailService.sendEmail(
      `${payload.email}`,
      'Confirmation Email.',
      { url: url },
      'confirmEmail',
    );
  }

  async setNewPassword(
    data: SetNewPasswordInput,
  ): Promise<AuthSuccessResponse> {
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
        throw new ApolloError(Error_Messages.InvalidOrExpired);
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
        throw new ApolloError(Error_Messages.InvalidOrExpired);
      } else {
        throw error;
      }
    }
  }

  async resendConfirmationEmail(
    data: ResendConfirmationEmailInput,
  ): Promise<AuthSuccessResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ApolloError(Error_Messages.UserConflict);
    }

    this.eventEmitter.emit(
      sendConfirmationEmail,
      new SendConfirmationEmailEvent(data.email),
    );

    return {
      success: true,
    };
  }

  async confirmEmail(data: ConfirmEmailInput): Promise<AuthSuccessResponse> {
    const decoded = await this.jwtService.verifyAsync<JwtPayload>(data.token, {
      secret: this.configService.get('JWT_RESET_SECRET'),
    });

    const user = await this.prisma.user.findUnique({
      where: { email: decoded?.email },
    });

    if (user.isEmailConfirmed === true || decoded === null) {
      throw new ApolloError(Error_Messages.InvalidOrExpired);
    }

    await this.prisma.user.update({
      where: { email: decoded?.email },
      data: {
        isEmailConfirmed: true,
      },
    });

    return { success: true };
  }

  async signIn(data: SignInInput, context: Ctx): Promise<AuthSuccessResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user.isEmailConfirmed) {
      throw new ApolloError(Error_Messages.UnconfirmedEmail);
    }

    if (user && (await bcrypt.compare(data.password, user.password))) {
      const payload: JwtPayload = { email: user.email };
      const accessToken = await this.jwtService.sign(payload);

      // Set the JWT in a cookie
      context.res.cookie('token', accessToken, this.cookieOptions);

      return { success: true };
    } else {
      throw new ApolloError(Error_Messages.InvalidCredentials);
    }
  }

  async createResetPasswordLink(
    resetPasswordLinkInput: CreateResetPasswordLinkInput,
  ): Promise<AuthSuccessResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: resetPasswordLinkInput.email },
    });

    if (!user) {
      throw new ApolloError(Error_Messages.SomethingWentWrong);
    }

    const payload: JwtPayload = { email: resetPasswordLinkInput.email };
    const resetToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_RESET_SECRET'),
      expiresIn: '20m',
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

  async logout(context: Ctx): Promise<AuthSuccessResponse> {
    // Clear  cookie
    context.res.clearCookie('token', this.cookieOptions);
    return { success: true };
  }
}
