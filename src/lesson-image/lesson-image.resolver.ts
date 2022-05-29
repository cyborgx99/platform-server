import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { UserWithoutPassword } from 'src/user/dto/user.dto';

import {
  CreateLessonImageInput,
  DeleteLessonImageInput,
  GetImagesQueryArgs,
  PaginatedImagesResponse,
  UpdateLessonImageInput,
} from './dto/lesson-image.dto';
import { LessonImageService } from './lesson-image.service';
import { LessonImageModel } from './models/lesson-image.model';

@Resolver()
export class LessonImageResolver {
  constructor(private readonly lessonImageService: LessonImageService) {}

  @Mutation(() => LessonImageModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  createLessonImage(
    @Args('input') createLessonInput: CreateLessonImageInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonImageModel> {
    return this.lessonImageService.createLessonImage(
      createLessonInput,
      user.id,
    );
  }

  @Mutation(() => LessonImageModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  updateLessonImage(
    @Args('input') updateLessonInput: UpdateLessonImageInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonImageModel> {
    return this.lessonImageService.updateLessonImage(
      updateLessonInput,
      user.id,
    );
  }

  @Mutation(() => LessonImageModel)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  deleteLessonImage(
    @Args('input') deleteImageLessonInput: DeleteLessonImageInput,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<LessonImageModel> {
    return this.lessonImageService.deleteLessonImage(
      deleteImageLessonInput,
      user.id,
    );
  }

  @Query(() => PaginatedImagesResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getLessonImages(
    @Args() getImagesQueryArgs: GetImagesQueryArgs,
    @UserDecorator() user: UserWithoutPassword,
  ): Promise<PaginatedImagesResponse> {
    return this.lessonImageService.getLessonImages(getImagesQueryArgs, user.id);
  }
}
