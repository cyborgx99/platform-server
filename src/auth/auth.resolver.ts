import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { GqlAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import {
  SignInInput,
  SignInResponse,
  SignUpInput,
  SignUpResponse,
} from './auth.type';
import { UserDecorator } from './user';

@Resolver(() => SignUpResponse)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => SignInResponse)
  signIn(
    @Args('input') signInInput: SignInInput,
  ): Promise<{ accessToken: string }> {
    return this.authService.getUserToken(signInInput);
  }

  @Mutation(() => SignUpResponse)
  signUp(@Args('input') signUpInput: SignUpInput): Promise<User> {
    return this.authService.createUser(signUpInput);
  }

  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  getShit(@UserDecorator() user: User): string {
    console.log(user);
    return '123';
  }
}
