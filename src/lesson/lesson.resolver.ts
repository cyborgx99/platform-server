import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UserWithoutPassword } from 'src/user/dto/user.dto';

import {
  CreateLessonInput,
  DeleteLessonResponse,
  GetLessonsQueryArgs,
  PaginatedLessonsResponse,
  UpdateLessonInput,
} from './dto/lesson.dto';
import { LessonService } from './lesson.service';
import { LessonModel } from './models/lesson.model';

@Resolver()
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}

  @Mutation(() => LessonModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  createLesson(
    @Args('input') createLessonInput: CreateLessonInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonModel> {
    return this.lessonService.createLesson(createLessonInput, user.id);
  }

  @Mutation(() => LessonModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateLesson(
    @Args('input') updateLessonInput: UpdateLessonInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonModel> {
    return this.lessonService.updateLesson(updateLessonInput, user.id);
  }

  @Query(() => PaginatedLessonsResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getLessons(
    @Args() getLessonsQueryArgs: GetLessonsQueryArgs,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<PaginatedLessonsResponse> {
    return this.lessonService.getLessons(getLessonsQueryArgs, user.id);
  }

  @Mutation(() => DeleteLessonResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  deleteLesson(
    @Args('id') id: string,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<DeleteLessonResponse> {
    return this.lessonService.deleteLesson(id, user.id);
  }
}
