import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType({ description: 'User' })
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Date)
  createdAt: Date;
}
