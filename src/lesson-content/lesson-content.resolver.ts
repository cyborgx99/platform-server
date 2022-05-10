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
  CreateLessonContentInput,
  DeleteLessonContentResponse,
  GetLessonContentsResponse,
  UpdateLessonContentInput,
} from './dto/lesson-content.dto';
import { LessonContentService } from './lesson-content.service';
import { LessonContent } from './models/lesson-content.model';

@Resolver()
export class LessonContentResolver {
  constructor(private readonly lessonContentService: LessonContentService) {}

  @Mutation(() => LessonContent)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  createLessonContent(
    @Args('input') createLessonContentInput: CreateLessonContentInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonContent> {
    return this.lessonContentService.createLessonContent(
      createLessonContentInput,
      user.id,
    );
  }

  @Query(() => GetLessonContentsResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getLessonContents(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @UserDecorator() user: UserWithoutPassword,
    @Args('search', { nullable: true }) search?: string,
    @Args('sortOrder', { nullable: true, type: () => SortOrder })
    sortOrder?: SortOrder,
  ): Promise<GetLessonContentsResponse> {
    return this.lessonContentService.getLessonContents(
      offset,
      limit,
      user.id,
      search,
      sortOrder,
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

  @Mutation(() => LessonContent)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateLessonContent(
    @Args('input') updateLessonContentInput: UpdateLessonContentInput,
    @UserDecorator() user: UserWithoutPassword,
  ) {
    return this.lessonContentService.updateLessonContent(
      updateLessonContentInput,
      user.id,
    );
  }
}
