import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateLessonContentInput } from './dto/lesson-content.dto';
import { LessonContentService } from './lesson-content.service';
import { LessonContent } from './models/lesson-content.model';

@Resolver()
export class LessonContentResolver {
  constructor(private readonly lessonContentService: LessonContentService) {}

  @Mutation(() => LessonContent)
  createLessonContent(
    @Args('input') createLessonContentInput: CreateLessonContentInput,
  ) {
    return this.lessonContentService.createLessonContent(
      createLessonContentInput,
    );
  }
}
