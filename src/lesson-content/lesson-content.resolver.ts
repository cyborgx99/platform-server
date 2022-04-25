import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';

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
  ): Promise<LessonContent> {
    return this.lessonContentService.createLessonContent(
      createLessonContentInput,
    );
  }

  @Query(() => GetLessonContentsResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getLessonContents(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('search', { nullable: true }) search?: string,
  ): Promise<GetLessonContentsResponse> {
    return this.lessonContentService.getLessonContents(offset, limit, search);
  }

  @Mutation(() => DeleteLessonContentResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  deleteLessonContent(
    @Args('id') id: string,
  ): Promise<DeleteLessonContentResponse> {
    return this.lessonContentService.deleteLessonContent(id);
  }

  @Mutation(() => LessonContent)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateLessonContent(
    @Args('input') updateLessonContentInput: UpdateLessonContentInput,
  ) {
    return this.lessonContentService.updateLessonContent(
      updateLessonContentInput,
    );
  }
}
