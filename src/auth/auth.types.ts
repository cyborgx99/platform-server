import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Role, User } from '@prisma/client';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Request, Response } from 'express';

registerEnumType(Role, {
  name: 'Role',
});

export type UserWithoutPassword = Omit<User, 'password'>;

export interface Ctx {
  req: Request;
  res: Response;
}

export interface JwtPayload {
  email: string;
}

@ObjectType('User')
export class GetUserResponse {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;
}

@ObjectType()
export class SignUpResponse {
  @Field()
  success: boolean;
}

@ObjectType()
export class SignInResponse {
  @Field()
  success: boolean;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  success: boolean;
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
  @Matches(/^(?=(.*\d){1})(.*\S)(?=.*[a-zA-Z\S])[0-9a-zA-Z\S]{6,}/, {
    message:
      'Password must have at least 6 characters, one letter, and one number',
  })
  @MaxLength(32)
  password: string;

  @Field(() => Role, { defaultValue: Role.USER })
  role?: Role;
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
