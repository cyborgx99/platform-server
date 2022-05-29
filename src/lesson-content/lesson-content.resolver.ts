import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserWithoutPassword } from 'src/user/dto/user.dto';
import { CurrentUser } from 'src/user/user.decorator';

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
    @CurrentUser() user: UserWithoutPassword,
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
    @CurrentUser() user: UserWithoutPassword,
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
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<DeleteLessonContentResponse> {
    return this.lessonContentService.deleteLessonContent(id, user.id);
  }

  @Mutation(() => LessonContentModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateLessonContent(
    @Args('input') updateLessonContentInput: UpdateLessonContentInput,
    @CurrentUser() user: UserWithoutPassword,
  ): Promise<LessonContentModel> {
    return this.lessonContentService.updateLessonContent(
      updateLessonContentInput,
      user.id,
    );
  }
}
