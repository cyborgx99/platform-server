import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { SignUpInput, SignUpResponse } from './auth.type';

@Resolver(() => SignUpResponse)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => SignUpResponse)
  signIn(): Promise<User> {
    return this.authService.getMe();
  }

  @Mutation(() => SignUpResponse)
  signUp(@Args('input') signUpInput: SignUpInput): Promise<User> {
    return this.authService.createUser(signUpInput);
  }
}
