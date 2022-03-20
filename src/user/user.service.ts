import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import { GetUsersDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(data: GetUsersDto) {
    const [users, totalUsers] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: { role: Role.USER },
        take: data.limit,
        skip: data.cursor ? 1 : 0,
        cursor: {
          id: data.cursor,
        },
        select: {
          password: false,
          lastName: true,
          name: true,
          id: true,
          role: true,
          email: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    const lastPostInResults = users[data.limit - 1];
    const cursor = lastPostInResults.id;
    const pages = Math.floor(totalUsers / data.limit);

    return {
      data: users,
      cursor,
      pages,
    };
  }
}
