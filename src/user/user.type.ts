import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserResponse {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class UserInput {
  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
