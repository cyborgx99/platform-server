import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UserWithoutPassword } from 'src/user/dto/user.dto';

import { ClassroomService } from './classroom.service';
import {
  CreateClassroomInput,
  DeleteClassroomResponse,
  GetClassroomsQueryArgs,
  PaginatedClassroomsResponse,
  UpdateClassroomInput,
} from './dto/clasroom.dto';
import { ClassroomModel } from './model/classroom.model';

@Resolver()
export class ClassroomResolver {
  constructor(private readonly classroomService: ClassroomService) {}

  @Mutation(() => ClassroomModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  createClassroom(
    @Args('input') createClassroomInput: CreateClassroomInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<ClassroomModel> {
    return this.classroomService.createClassroom(createClassroomInput, user.id);
  }

  @Query(() => ClassroomModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getSingleClassroom(
    @Args('id') classroomId: string,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<ClassroomModel> {
    return this.classroomService.getSingleClassroom(classroomId, user.id);
  }

  @Query(() => PaginatedClassroomsResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getClassrooms(
    @Args() getClassroomsQueryArgs: GetClassroomsQueryArgs,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<PaginatedClassroomsResponse> {
    return this.classroomService.getClassrooms(getClassroomsQueryArgs, user.id);
  }

  @Mutation(() => ClassroomModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateClassroom(
    @Args('input') updateClassroomInput: UpdateClassroomInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<ClassroomModel> {
    return this.classroomService.updateClassroom(updateClassroomInput, user.id);
  }

  @Mutation(() => DeleteClassroomResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  deleteClassroom(
    @Args('id') id: string,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<DeleteClassroomResponse> {
    return this.classroomService.deleteClassroom(id, user.id);
  }
}
