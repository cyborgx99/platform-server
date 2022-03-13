import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import {
  AuthSuccessResponse,
  CreateResetPasswordLinkInput,
  Ctx,
  GetUserResponse,
  SignInInput,
  SignUpInput,
  UserWithoutPassword,
} from './auth.types';
import { UserDecorator } from './user';

@Resolver(() => GetUserResponse)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthSuccessResponse)
  signIn(
    @Args('input') signInInput: SignInInput,
    @Context() context: Ctx,
  ): Promise<AuthSuccessResponse> {
    return this.authService.getUserToken(signInInput, context);
  }

  @Mutation(() => AuthSuccessResponse)
  signUp(
    @Args('input') signUpInput: SignUpInput,
  ): Promise<AuthSuccessResponse> {
    return this.authService.createUser(signUpInput);
  }

  @Mutation(() => AuthSuccessResponse)
  resetPasswordLink(
    @Args('input') createResetPasswordLinkInput: CreateResetPasswordLinkInput,
  ): Promise<AuthSuccessResponse> {
    return this.authService.createResetPasswordLink(
      createResetPasswordLinkInput,
    );
  }

  @Mutation(() => AuthSuccessResponse)
  @UseGuards(GqlAuthGuard)
  logout(@Context() context: Ctx): Promise<AuthSuccessResponse> {
    return this.authService.logout(context);
  }

  @Query(() => GetUserResponse)
  @UseGuards(GqlAuthGuard)
  getUser(@UserDecorator() user: UserWithoutPassword): UserWithoutPassword {
    return user;
  }
}
