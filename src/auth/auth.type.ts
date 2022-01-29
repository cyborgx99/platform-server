import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

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

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string;
}

enum UserRole {
  USER = 'USER',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
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
  @MaxLength(32)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/g, {
    message:
      'Password must have at least 6 characters, one letter, and one number',
  })
  password: string;

  @Field({ defaultValue: UserRole.USER })
  role?: UserRole;
}

@InputType()
export class SignInInput {
  @Field()
  @IsString()
  @MinLength(2)
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @Field()
  @IsString()
  @MaxLength(32)
  password: string;
}
