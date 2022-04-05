import { Field, InputType, ObjectType } from '@nestjs/graphql';

import {
  LessonContent,
  LessonContentSentence,
} from '../models/lesson-content.model';

@InputType()
export class CreateLessonContentInput {
  @Field()
  title: string;

  @Field(() => [LessonContentSentence])
  sentences: LessonContentSentence[];
}

@ObjectType()
export class GetLessonContentsResponse {
  @Field(() => [LessonContent], { nullable: 'items' })
  data: LessonContent[];

  @Field()
  totalCount: number;

  @Field()
  pages: number;
}
