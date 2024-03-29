import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Role } from '@prisma/client';
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

export interface Ctx {
  req: Request;
  res: Response;
}

export interface JwtPayload {
  email: string;
}

@ObjectType()
export class AuthSuccessResponse {
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
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message:
      'Password must have at least 6 characters, one letter, and one number',
  })
  @MaxLength(32)
  password: string;

  @Field(() => Role, { defaultValue: Role.USER })
  role?: Role;
}

@InputType()
export class CreateResetPasswordLinkInput {
  @Field()
  @IsString()
  @MinLength(2)
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}
@InputType()
export class SetNewPasswordInput {
  @Field()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message:
      'Password must have at least 6 characters, one letter, and one number',
  })
  @MaxLength(32)
  password: string;

  @Field()
  @IsString()
  resetToken: string;
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

@InputType()
export class ResendConfirmationEmailInput {
  @Field()
  @IsString()
  @MinLength(2)
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}

@InputType()
export class ConfirmEmailInput {
  @Field()
  @IsString()
  token: string;
}
