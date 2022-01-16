import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';
import { UserType } from './user.type';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => UserType)
  createUser(createUserInput: Prisma.UserCreateInput) {
    return this.userService.createUser(createUserInput);
  }
}
