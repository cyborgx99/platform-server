import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/dto/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';

import {
  CreateLessonContentInput,
  GetLessonContentsResponse,
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
}
