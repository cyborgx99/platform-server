import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import { GetUsersResponse } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(offset: number, limit: number): Promise<GetUsersResponse> {
    const [users, totalUsers] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: { role: Role.USER },
        take: limit,
        skip: offset ?? 0,
        select: {
          password: false,
          lastName: true,
          name: true,
          id: true,
          role: true,
          email: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({
        where: {
          role: Role.USER,
        },
      }),
    ]);

    const pages = Math.ceil(totalUsers / limit);

    return {
      data: users,
      pages,
      totalCount: totalUsers,
    };
  }
}
