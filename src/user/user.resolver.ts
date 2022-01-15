import { Resolver, Query } from '@nestjs/graphql';
import { UserType } from './user.type';

@Resolver((of) => UserType)
export class UserResolver {
  @Query((returns) => UserType)
  user() {
    return {
      id: '123123',
      name: 'ffs',
      lastName: 'up',
      email: 'er',
      password: '123',
    };
  }
}
