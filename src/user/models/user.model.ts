import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { AbstractModel } from 'src/common/models/abstract.model';

@ObjectType({ description: 'User' })
export class User extends AbstractModel {
  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;
}
