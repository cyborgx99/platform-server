import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/dto/auth.roles.guard';
import { Roles } from 'src/auth/roles.decorator';

import {
  CreateLessonImageInput,
  DeleteLessonImageInput,
  GetLessonImagesResponse,
  UpdateLessonImageInput,
} from './dto/lesson-image.dto';
import { LessonImageService } from './lesson-image.service';
import { LessonImage } from './models/lesson-image.model';

@Resolver()
export class LessonImageResolver {
  constructor(private readonly lessonImageService: LessonImageService) {}

  @Mutation(() => LessonImage)
  createLessonImage(@Args('input') createLessonInput: CreateLessonImageInput) {
    return this.lessonImageService.createLessonImage(createLessonInput);
  }

  @Mutation(() => LessonImage)
  updateLessonImage(@Args('input') updateLessonInput: UpdateLessonImageInput) {
    return this.lessonImageService.updateLessonImage(updateLessonInput);
  }

  @Mutation(() => LessonImage)
  deleteLessonImage(
    @Args('input') deleteImageLessonInput: DeleteLessonImageInput,
  ) {
    return this.lessonImageService.deleteLessonImage(deleteImageLessonInput);
  }

  @Query(() => GetLessonImagesResponse)
  @Roles(Role.TEACHER)
  @UseGuards(GqlAuthGuard, RolesGuard)
  getLessonImages(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<GetLessonImagesResponse> {
    return this.lessonImageService.getLessonImages(offset, limit);
  }
}
