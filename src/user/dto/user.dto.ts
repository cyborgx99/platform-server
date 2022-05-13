import { ArgsType, ObjectType } from '@nestjs/graphql';
import {
  PaginatedQueryArgs,
  PaginatedResponse,
} from 'src/common/dto/common.dto';

import { User } from '../models/user.model';

export type UserWithoutPassword = Omit<User, 'password' | 'resetToken'>;
@ObjectType()
export class PaginatedUsers extends PaginatedResponse(User) {}

@ArgsType()
export class GetUsersQueryArgs extends PaginatedQueryArgs {}
