import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';

import {
  CreateLessonImageInput,
  DeleteLessonImageInput,
  GetLessonImagesResponse,
  SortOrder,
  UpdateLessonImageInput,
} from './dto/lesson-image.dto';
import { LessonImageService } from './lesson-image.service';
import { LessonImage } from './models/lesson-image.model';

@Resolver()
export class LessonImageResolver {
  constructor(private readonly lessonImageService: LessonImageService) {}

  @Mutation(() => LessonImage)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  createLessonImage(
    @Args('input') createLessonInput: CreateLessonImageInput,
  ): Promise<LessonImage> {
    return this.lessonImageService.createLessonImage(createLessonInput);
  }

  @Mutation(() => LessonImage)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateLessonImage(
    @Args('input') updateLessonInput: UpdateLessonImageInput,
  ): Promise<LessonImage> {
    return this.lessonImageService.updateLessonImage(updateLessonInput);
  }

  @Mutation(() => LessonImage)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  deleteLessonImage(
    @Args('input') deleteImageLessonInput: DeleteLessonImageInput,
  ): Promise<LessonImage> {
    return this.lessonImageService.deleteLessonImage(deleteImageLessonInput);
  }

  @Query(() => GetLessonImagesResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getLessonImages(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('sortOrder', { nullable: true, type: () => SortOrder })
    sortOrder?: SortOrder,
  ): Promise<GetLessonImagesResponse> {
    return this.lessonImageService.getLessonImages(
      offset,
      limit,
      search,
      sortOrder,
    );
  }
}
