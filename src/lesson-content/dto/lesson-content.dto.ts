import { Field, InputType } from '@nestjs/graphql';

import { LessonContentSentence } from '../models/lesson-content.model';

@InputType()
export class CreateLessonContentInput {
  @Field(() => [LessonContentSentence])
  sentences: LessonContentSentence[];
}
