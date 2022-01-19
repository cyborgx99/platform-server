import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async getMe(data: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({ where: { email: data.email } });
  }
}
