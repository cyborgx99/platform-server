import {
  ArgsType,
  Field,
  ID,
  InputType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';
import {
  PaginatedQueryArgs,
  PaginatedResponse,
} from 'src/common/dto/common.dto';

import {
  LessonContentModel,
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
export class PaginatedContentsResponse extends PaginatedResponse(
  LessonContentModel,
) {}

@ArgsType()
export class GetContentsQueryArgs extends PaginatedQueryArgs {}

@ObjectType()
export class DeleteLessonContentResponse {
  @Field(() => ID)
  id: string;
}
