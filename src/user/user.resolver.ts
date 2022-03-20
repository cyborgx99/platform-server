import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { GetUserResponse, UserWithoutPassword } from 'src/auth/auth.types';
import { UserDecorator } from 'src/auth/user';

@Resolver()
export class UserResolver {
  @Query(() => GetUserResponse)
  @UseGuards(GqlAuthGuard)
  @UseGuards(RolesGuard)
  getUsers(@UserDecorator() user: UserWithoutPassword): UserWithoutPassword {
    return user;
  }
}
