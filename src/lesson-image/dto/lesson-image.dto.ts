import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';

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
  @Field()
  id: number;

  @Field(() => String, { nullable: true })
  publicId?: string;
}

@InputType()
export class UpdateLessonImageInput extends PartialType(
  CreateLessonImageInput,
) {
  @Field()
  id: number;
}
@ObjectType()
export class GetLessonImagesResponse {
  @Field(() => [LessonImage], { nullable: 'items' })
  data: LessonImage[];

  @Field()
  totalCount: number;

  @Field()
  pages: number;
}
