import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { User } from '../models/user.model';

export type UserWithoutPassword = Omit<User, 'password' | 'resetToken'>;
@InputType()
export class GetUsersArgs {
  @Field()
  limit: number;

  @Field({ nullable: true })
  offset?: number;
}
@ObjectType()
export class GetUsersResponse {
  @Field(() => [User], { nullable: 'items' })
  data: User[];

  @Field()
  totalCount: number;

  @Field()
  pages: number;
}
