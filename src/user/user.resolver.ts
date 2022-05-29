import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/user/user.decorator';

import {
  GetUsersQueryArgs,
  PaginatedUsers,
  UserWithoutPassword,
} from './dto/user.dto';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  getUser(@CurrentUser() user: UserWithoutPassword): UserWithoutPassword {
    return user;
  }

  @Query(() => PaginatedUsers)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getUsers(@Args() getUsersArgs: GetUsersQueryArgs): Promise<PaginatedUsers> {
    return this.userService.getUsers(getUsersArgs);
  }
}
