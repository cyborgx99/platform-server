import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserWithoutPassword } from 'src/user/dto/user.dto';
import { UserDecorator } from 'src/user/user.decorator';

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
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonImage> {
    return this.lessonImageService.createLessonImage(
      createLessonInput,
      user.id,
    );
  }

  @Mutation(() => LessonImage)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateLessonImage(
    @Args('input') updateLessonInput: UpdateLessonImageInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonImage> {
    return this.lessonImageService.updateLessonImage(
      updateLessonInput,
      user.id,
    );
  }

  @Mutation(() => LessonImage)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  deleteLessonImage(
    @Args('input') deleteImageLessonInput: DeleteLessonImageInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonImage> {
    return this.lessonImageService.deleteLessonImage(
      deleteImageLessonInput,
      user.id,
    );
  }

  @Query(() => GetLessonImagesResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getLessonImages(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @UserDecorator() user: UserWithoutPassword,
    @Args('search', { nullable: true }) search?: string,
    @Args('sortOrder', { nullable: true, type: () => SortOrder })
    sortOrder?: SortOrder,
  ): Promise<GetLessonImagesResponse> {
    return this.lessonImageService.getLessonImages(
      offset,
      limit,
      user.id,
      search,
      sortOrder,
    );
  }
}
