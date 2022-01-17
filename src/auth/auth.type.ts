import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@ObjectType('User')
export class SignUpResponse {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field()
  email: string;
}

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  name: string;

  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  lastName: string;

  @Field()
  @IsString()
  @MinLength(2)
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
