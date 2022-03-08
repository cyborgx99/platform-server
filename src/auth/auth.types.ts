import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Role, User } from '@prisma/client';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Request, Response } from 'express';

enum UserRole {
  USER = 'USER',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

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

  @Field()
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
