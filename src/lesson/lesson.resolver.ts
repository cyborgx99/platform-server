import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { SortOrder } from 'src/lesson-image/dto/lesson-image.dto';
import { UserWithoutPassword } from 'src/user/dto/user.dto';
import { UserDecorator } from 'src/user/user.decorator';

import {
  CreateLessonInput,
  DeleteLessonResponse,
  GetLessonsResponse,
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

  @Query(() => GetLessonsResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getLessons(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @UserDecorator() user: UserWithoutPassword,
    @Args('search', { nullable: true }) search?: string,
    @Args('sortOrder', { nullable: true, type: () => SortOrder })
    sortOrder?: SortOrder,
  ) {
    return this.lessonService.getLessons(
      offset,
      limit,
      user.id,
      search,
      sortOrder,
    );
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
