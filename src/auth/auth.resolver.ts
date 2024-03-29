import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import {
  AuthSuccessResponse,
  ConfirmEmailInput,
  CreateResetPasswordLinkInput,
  Ctx,
  ResendConfirmationEmailInput,
  SetNewPasswordInput,
  SignInInput,
  SignUpInput,
} from './dto/auth.dto';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthSuccessResponse)
  signIn(
    @Args('input') signInInput: SignInInput,
    @Context() context: Ctx,
  ): Promise<AuthSuccessResponse> {
    return this.authService.signIn(signInInput, context);
  }

  @Mutation(() => AuthSuccessResponse)
  resendConfirmationEmail(
    @Args('input') resendConfirmationEmailInput: ResendConfirmationEmailInput,
  ): Promise<AuthSuccessResponse> {
    return this.authService.resendConfirmationEmail(
      resendConfirmationEmailInput,
    );
  }

  @Mutation(() => AuthSuccessResponse)
  confirmEmail(
    @Args('input') confirmEmailInput: ConfirmEmailInput,
  ): Promise<AuthSuccessResponse> {
    return this.authService.confirmEmail(confirmEmailInput);
  }

  @Mutation(() => AuthSuccessResponse)
  signUp(
    @Args('input') signUpInput: SignUpInput,
  ): Promise<AuthSuccessResponse> {
    return this.authService.createUser(signUpInput);
  }

  @Mutation(() => AuthSuccessResponse)
  resetPasswordLink(
    @Args('input')
    createResetPasswordLinkInput: CreateResetPasswordLinkInput,
  ): Promise<AuthSuccessResponse> {
    return this.authService.createResetPasswordLink(
      createResetPasswordLinkInput,
    );
  }

  @Mutation(() => AuthSuccessResponse)
  setNewPassword(
    @Args('input') setNewPasswordInput: SetNewPasswordInput,
  ): Promise<AuthSuccessResponse> {
    return this.authService.setNewPassword(setNewPasswordInput);
  }

  @Mutation(() => AuthSuccessResponse)
  @UseGuards(GqlAuthGuard)
  logout(@Context() context: Ctx): Promise<AuthSuccessResponse> {
    return this.authService.logout(context);
  }
}
