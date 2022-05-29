import {
  ArgsType,
  Field,
  ID,
  InputType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import {
  PaginatedQueryArgs,
  PaginatedResponse,
} from 'src/common/dto/common.dto';

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
export class PaginatedLessonsResponse extends PaginatedResponse(LessonModel) {}

@ArgsType()
export class GetLessonsQueryArgs extends PaginatedQueryArgs {}

@ObjectType()
export class DeleteLessonResponse {
  @Field(() => ID)
  id: string;
}
