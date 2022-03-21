import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/dto/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserDecorator } from 'src/user/user.decorator';

import {
  GetUsersArgs,
  GetUsersResponse,
  UserWithoutPassword,
} from './dto/user.dto';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  getUser(@UserDecorator() user: UserWithoutPassword): UserWithoutPassword {
    return user;
  }

  @Query(() => GetUsersResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getUsers(
    @Args('getUsersArgs') getUsersArgs: GetUsersArgs,
  ): Promise<GetUsersResponse> {
    return this.userService.getUsers(getUsersArgs);
  }
}
