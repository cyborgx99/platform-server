import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UserWithoutPassword } from 'src/user/dto/user.dto';

import {
  CreateLessonContentInput,
  DeleteLessonContentResponse,
  GetContentsQueryArgs,
  PaginatedContentsResponse,
  UpdateLessonContentInput,
} from './dto/lesson-content.dto';
import { LessonContentService } from './lesson-content.service';
import { LessonContentModel } from './models/lesson-content.model';

@Resolver()
export class LessonContentResolver {
  constructor(private readonly lessonContentService: LessonContentService) {}

  @Mutation(() => LessonContentModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  createLessonContent(
    @Args('input') createLessonContentInput: CreateLessonContentInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonContentModel> {
    return this.lessonContentService.createLessonContent(
      createLessonContentInput,
      user.id,
    );
  }

  @Query(() => PaginatedContentsResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getLessonContents(
    @Args() getLessonContentsQueryArgs: GetContentsQueryArgs,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<PaginatedContentsResponse> {
    return this.lessonContentService.getLessonContents(
      getLessonContentsQueryArgs,
      user.id,
    );
  }

  @Mutation(() => DeleteLessonContentResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  deleteLessonContent(
    @Args('id') id: string,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<DeleteLessonContentResponse> {
    return this.lessonContentService.deleteLessonContent(id, user.id);
  }

  @Mutation(() => LessonContentModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateLessonContent(
    @Args('input') updateLessonContentInput: UpdateLessonContentInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonContentModel> {
    return this.lessonContentService.updateLessonContent(
      updateLessonContentInput,
      user.id,
    );
  }
}
