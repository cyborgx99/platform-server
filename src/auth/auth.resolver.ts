import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { SignInInput, SignUpInput, SignUpResponse } from './auth.type';

@Resolver(() => SignUpResponse)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => SignUpResponse)
  signIn(@Args('input') signInInput: SignInInput): Promise<User> {
    return this.authService.getMe(signInInput);
  }

  @Mutation(() => SignUpResponse)
  signUp(@Args('input') signUpInput: SignUpInput): Promise<User> {
    return this.authService.createUser(signUpInput);
  }
}
