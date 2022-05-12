import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { SortOrder } from 'src/lesson-image/dto/lesson-image.dto';
import { UserWithoutPassword } from 'src/user/dto/user.dto';
import { UserDecorator } from 'src/user/user.decorator';

import { ClassroomService } from './classroom.service';
import {
  CreateClassroomInput,
  DeleteClassroomResponse,
  GetClassroomsResponse,
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

  @Query(() => GetClassroomsResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getClassrooms(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @UserDecorator() user: UserWithoutPassword,
    @Args('search', { nullable: true }) search?: string,
    @Args('sortOrder', { nullable: true, type: () => SortOrder })
    sortOrder?: SortOrder,
  ) {
    return this.classroomService.getClassrooms(
      offset,
      limit,
      user.id,
      search,
      sortOrder,
    );
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

  @Subscription(() => String)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateNotesEditor() {
    return '12';
  }
}
