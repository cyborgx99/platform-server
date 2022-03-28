import { Field, InputType, ObjectType } from '@nestjs/graphql';

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

@ObjectType()
export class GetLessonImagesResponse {
  @Field(() => [LessonImage], { nullable: 'items' })
  data: LessonImage[];

  @Field()
  totalCount: number;

  @Field()
  pages: number;
}
