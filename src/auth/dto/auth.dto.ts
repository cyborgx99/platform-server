export class CreateUserDto {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export class SignInDto {
  email: string;
  password: string;
}

export class ResetPasswordLinkDto {
  email: string;
}

export class SetNewPasswordDto {
  password: string;
  resetToken: string;
}
