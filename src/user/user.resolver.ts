import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserInput, UserResponse } from './user.type';

@Resolver(() => UserResponse)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserResponse)
  getMe(): Promise<User> {
    return this.userService.getMe();
  }

  @Mutation(() => UserResponse)
  createUser(@Args('input') createUserInput: UserInput): Promise<User> {
    return this.userService.createUser(createUserInput);
  }
}
