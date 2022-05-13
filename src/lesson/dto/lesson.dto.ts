import {
  ArgsType,
  Field,
  ID,
  InputType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { PaginatedQueryArgs } from 'src/common/dto/common.dto';
import { LessonContent } from 'src/lesson-content/models/lesson-content.model';
import { LessonImage } from 'src/lesson-image/models/lesson-image.model';

import { LessonModel } from '../models/lesson.model';

@InputType()
export class LessonPage {
  @Field()
  id: string;

  @Field()
  lessonImageId: string;

  @Field()
  lessonContentId: string;
}

@ObjectType()
export class LessonPageObject {
  @Field(() => ID)
  id: string;

  @Field(() => LessonImage)
  lessonImage: LessonImage;

  @Field(() => LessonContent)
  lessonContent: LessonContent;
}

@InputType()
export class CreateLessonInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [LessonPage], { nullable: 'items' })
  pages: LessonPage[];
}

@InputType()
export class UpdateLessonInput extends PartialType(CreateLessonInput) {
  @Field(() => ID)
  id: string;
}

@ObjectType()
export class PaginatedLessonsResponse {
  @Field(() => [LessonModel])
  data: LessonModel[];

  @Field()
  totalCount: number;

  @Field()
  pages: number;

  @Field()
  hasMore: boolean;
}

@ArgsType()
export class GetLessonsQueryArgs extends PaginatedQueryArgs {}

@ObjectType()
export class DeleteLessonResponse {
  @Field(() => ID)
  id: string;
}
