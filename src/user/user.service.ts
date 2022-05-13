import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

import { GetUsersQueryArgs, PaginatedUsers } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers({
    limit,
    offset,
    search,
    sortOrder,
  }: GetUsersQueryArgs): Promise<PaginatedUsers> {
    const whereOptions: Prisma.UserWhereInput = {
      role: Role.USER,
      OR: [
        {
          name: {
            startsWith: search,
            mode: 'insensitive',
          },
        },
        { name: { endsWith: search, mode: 'insensitive' } },
        {
          lastName: {
            startsWith: search,
            mode: 'insensitive',
          },
        },
        {
          lastName: { endsWith: search, mode: 'insensitive' },
        },
      ],
    };

    const [users, totalUsers] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: whereOptions,
        take: limit,
        skip: offset ?? 0,
        orderBy: {
          lastName: sortOrder,
        },
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
        where: whereOptions,
      }),
    ]);

    const pages = Math.ceil(totalUsers / limit);
    const hasMore = offset < totalUsers && totalUsers > limit;

    return {
      data: users,
      pages,
      totalCount: totalUsers,
      hasMore,
    };
  }
}
