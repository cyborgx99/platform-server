import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';

import {
  LessonContent,
  LessonContentSentence,
} from '../models/lesson-content.model';

@InputType()
export class CreateLessonContentInput {
  @Field()
  @IsString()
  @MaxLength(32)
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

@ObjectType()
export class DeleteLessonContentResponse {
  @Field(() => ID)
  id: string;
}
