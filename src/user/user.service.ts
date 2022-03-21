import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import { GetUsersArgs, GetUsersResponse } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(data: GetUsersArgs): Promise<GetUsersResponse> {
    const options = {
      where: { role: Role.USER },
      take: data.limit,
      select: {
        password: false,
        lastName: true,
        name: true,
        id: true,
        role: true,
        email: true,
        createdAt: true,
      },
    };

    const optionsWithCursor = {
      ...options,
      skip: 1,
      cursor: {
        id: data.cursor,
      },
    };

    const [users, totalUsers] = await this.prisma.$transaction([
      this.prisma.user.findMany(data.cursor ? optionsWithCursor : options),
      this.prisma.user.count(),
    ]);

    const lastPostInResults = users[users.length - 1];
    const cursor = lastPostInResults?.id;
    const pages = Math.ceil(totalUsers / data.limit);

    return {
      data: users,
      cursor,
      pages,
    };
  }
}
