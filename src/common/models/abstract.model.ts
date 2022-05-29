import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AbstractModel {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Date)
  createdAt: Date;
}
