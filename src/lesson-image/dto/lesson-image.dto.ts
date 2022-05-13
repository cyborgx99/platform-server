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

import { LessonImage } from '../models/lesson-image.model';

@InputType()
export class CreateLessonImageInput {
  @Field()
  url: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  publicId?: string;
}

@InputType()
export class DeleteLessonImageInput {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  publicId?: string;
}

@InputType()
export class UpdateLessonImageInput extends PartialType(
  CreateLessonImageInput,
) {
  @Field(() => ID)
  id: string;
}
@ObjectType()
export class PaginatedImagesResponse extends PaginatedResponse(LessonImage) {}

@ArgsType()
export class GetImagesQueryArgs extends PaginatedQueryArgs {}
