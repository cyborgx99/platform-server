import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateLessonInput } from './dto/lesson.dto';
import { LessonService } from './lesson.service';
import { Lesson } from './models/lesson.model';

@Resolver()
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}
  @Mutation(() => Lesson)
  createLesson(@Args('input') createLessonInput: CreateLessonInput) {
    return this.lessonService.createLesson(createLessonInput);
  }
}
