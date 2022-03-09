import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import {
  Ctx,
  GetUserResponse,
  SignInInput,
  SignInResponse,
  SignUpInput,
  SignUpResponse,
  UserWithoutPassword,
} from './auth.types';
import { UserDecorator } from './user';

@Resolver(() => GetUserResponse)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResponse)
  signIn(
    @Args('input') signInInput: SignInInput,
    @Context() context: Ctx,
  ): Promise<SignInResponse> {
    return this.authService.getUserToken(signInInput, context);
  }

  @Mutation(() => SignUpResponse)
  signUp(@Args('input') signUpInput: SignUpInput): Promise<SignUpResponse> {
    return this.authService.createUser(signUpInput);
  }

  @Query(() => GetUserResponse)
  @UseGuards(GqlAuthGuard)
  getUser(@UserDecorator() user: UserWithoutPassword): UserWithoutPassword {
    return user;
  }
}
