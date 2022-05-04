import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';
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

@InputType()
export class UpdateLessonContentInput extends PartialType(
  CreateLessonContentInput,
) {
  @Field(() => ID)
  id: string;
}

@ObjectType()
export class GetLessonContentsResponse {
  @Field(() => [LessonContent])
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
